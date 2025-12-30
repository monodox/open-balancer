

import os
import time
import logging
from enum import Enum
from typing import Optional, Dict, Any, List
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, Request, BackgroundTasks, HTTPException, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai
from dotenv import load_dotenv

# Vertex AI imports
import vertexai
from vertexai.preview.generative_models import GenerativeModel as VertexGenerativeModel

# OpenTelemetry imports
from opentelemetry import trace, metrics
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.exporter.otlp.proto.http.metric_exporter import OTLPMetricExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

# Load environment variables
load_dotenv(dotenv_path="../.env.local") 
# Try loading from parent .env.local if available, else .env.local in current dir
if not os.getenv("GEMINI_API_KEY"):
    load_dotenv() 

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("open-balancer")

# --- Configuration & Constants ---

OTEL_SERVICE_NAME = os.getenv("OTEL_SERVICE_NAME", "open-balancer-backend")
OTEL_EXPORTER_OTLP_ENDPOINT = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "https://otlp.datadoghq.com")
OTEL_EXPORTER_OTLP_HEADERS = os.getenv("OTEL_EXPORTER_OTLP_HEADERS", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
GOOGLE_CLOUD_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")

USE_VERTEX = False

if GEMINI_API_KEY:
    logger.info("Using Google AI Studio (API Key)")
    genai.configure(api_key=GEMINI_API_KEY)
elif GOOGLE_CLOUD_PROJECT:
    logger.info(f"Using Google Vertex AI (Project: {GOOGLE_CLOUD_PROJECT})")
    vertexai.init(project=GOOGLE_CLOUD_PROJECT, location=GOOGLE_CLOUD_LOCATION)
    USE_VERTEX = True
else:
    logger.warning("No GEMINI_API_KEY or GOOGLE_CLOUD_PROJECT set. LLM calls will fail.")

# --- Brownout Models & State ---

class BrownoutMode(str, Enum):
    NORMAL = "normal"
    SOFT = "soft"
    HARD = "hard"
    EMERGENCY = "emergency"

class BrownoutState:
    _instance = None
    _mode: BrownoutMode = BrownoutMode.NORMAL
    _thresholds: Dict[str, Any] = {
        "soft": {"latency_p95": 2000, "error_rate": 0.05, "cost": 50},
        "hard": {"latency_p95": 5000, "error_rate": 0.10, "cost": 100},
        "emergency": {"latency_p95": 10000, "error_rate": 0.20, "cost": 200},
    }
    
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def get_mode(self) -> BrownoutMode:
        return self._mode

    def set_mode(self, mode: BrownoutMode):
        logger.info(f"Switching Brownout Mode from {self._mode} to {mode}")
        self._mode = mode
        
    def get_thresholds(self):
        return self._thresholds
    
    def update_thresholds(self, thresholds: Dict[str, Any]):
        self._thresholds.update(thresholds)

brownout_state = BrownoutState.get_instance()

# --- OpenTelemetry Setup ---

resource = Resource.create(attributes={
    "service.name": OTEL_SERVICE_NAME,
    "deployment.environment": os.getenv("ENVIRONMENT", "production")
})

# Trace Provider
trace_provider = TracerProvider(resource=resource)
trace_exporter = OTLPSpanExporter(
    endpoint=f"{OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces",
    headers=dict(item.split("=") for item in OTEL_EXPORTER_OTLP_HEADERS.split(",") if "=" in item)
)
trace_provider.add_span_processor(BatchSpanProcessor(trace_exporter))
trace.set_tracer_provider(trace_provider)
tracer = trace.get_tracer(__name__)

# Meter Provider
metric_reader = PeriodicExportingMetricReader(
    OTLPMetricExporter(
        endpoint=f"{OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics",
        headers=dict(item.split("=") for item in OTEL_EXPORTER_OTLP_HEADERS.split(",") if "=" in item)
    )
)
meter_provider = MeterProvider(resource=resource, metric_readers=[metric_reader])
metrics.set_meter_provider(meter_provider)
meter = metrics.get_meter(__name__)

# --- Custom Metrics ---

token_counter = meter.create_counter("custom.llm.tokens.used", description="Number of tokens consumed", unit="tokens")
cost_estimate_histogram = meter.create_histogram("custom.llm.cost.per_request", description="Estimated cost per LLM request", unit="USD")
brownout_mode_counter = meter.create_counter("custom.brownout.activations", description="Count of brownout mode activations")

# --- FastAPI App ---

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Open-Balancer Backend...")
    yield
    # Shutdown
    logger.info("Shutting down...")

app = FastAPI(title="Open-Balancer Backend", lifespan=lifespan)

# Auto-instrument FastAPI
FastAPIInstrumentor.instrument_app(app)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://open-balancer.web.app",
        "https://open-balancer.firebaseapp.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---

class AIChatRequest(BaseModel):
    message: str
    context: Optional[str] = "general"
    apiKey: Optional[str] = None # Optional usually, but required by frontend logic

class DatadogWebhookPayload(BaseModel):
    alert_id: Optional[str] = None
    alert_transition: Optional[str] = None
    tags: Optional[List[str]] = []
    title: Optional[str] = None
    # Allow extra fields
    class Config:
        extra = "allow"

class BrownoutUpdateRequest(BaseModel):
    mode: BrownoutMode
    reason: Optional[str] = None

class ThresholdsUpdateRequest(BaseModel):
    thresholds: Dict[str, Any]

# --- Logic Helper ---

def calculate_cost(tokens: int) -> float:
    # Gemini Pro estimate: $0.125 per 1M characters input? 
    # Current Gemini Pro pricing: Input: $0.50 / 1M. Output: $1.50 / 1M.
    # Approximation: $1.00 per 1M tokens.
    return (tokens / 1_000_000) * 1.0

async def generate_gemini_content(message: str, context: str, api_key: Optional[str], mode: BrownoutMode):
    # Determine system prompt based on mode
    system_prompts = {
        BrownoutMode.NORMAL: "You are an AI assistant for open-Balancer, helping users with LLM adaptive control and brownout strategies. Provide comprehensive, detailed responses.",
        BrownoutMode.SOFT: "You are an AI assistant for open-Balancer. Provide helpful but concise responses.",
        BrownoutMode.HARD: "You are an AI assistant for open-Balancer. Provide brief, focused responses.",
        BrownoutMode.EMERGENCY: "You are an AI assistant for open-Balancer. Provide very brief, essential responses only."
    }
    
    current_system_prompt = system_prompts.get(mode, system_prompts[BrownoutMode.NORMAL])
    
    # Context Logic ( Simplified )
    context_instruction = f"Context: {context}."
    
    full_prompt = f"{current_system_prompt}\n{context_instruction}\n\nUser: {message}"
    
    # Configuration based on mode
    generation_config = {"temperature": 0.7, "max_output_tokens": 1000}
    if mode == BrownoutMode.SOFT:
        generation_config = {"temperature": 0.5, "max_output_tokens": 500}
    elif mode == BrownoutMode.HARD:
        generation_config = {"temperature": 0.3, "max_output_tokens": 200}
    elif mode == BrownoutMode.EMERGENCY:
        generation_config = {"temperature": 0.1, "max_output_tokens": 50}

    # Use provided key or fallback
    active_key = api_key if api_key else GEMINI_API_KEY
    
    # Validation
    if not active_key and not USE_VERTEX:
        raise HTTPException(status_code=400, detail="API Key required or GCP Auth failed")
        
    try:
        text = ""
        tokens = 0
        
        if USE_VERTEX and not active_key:
             # Use Vertex AI
             model = VertexGenerativeModel("gemini-pro")
             response = await model.generate_content_async(
                 full_prompt,
                 generation_config=generation_config
             )
             text = response.text
             # Vertex approximation
             tokens = len(text) // 4
             
        else:
             # Use AI Studio
             genai.configure(api_key=active_key)
             model = genai.GenerativeModel("gemini-pro")
             response = model.generate_content(
                full_prompt,
                generation_config=generation_config
             )
             text = response.text
             tokens = len(text) // 4
        
        cost = calculate_cost(tokens)
        return text, tokens, cost

    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Routes ---

@app.post("/api/ai-chat")
async def ai_chat(request: AIChatRequest):
    start_time = time.time()
    current_mode = brownout_state.get_mode()
    
    with tracer.start_as_current_span("ai_chat_logic") as span:
        try:
            content, tokens, cost = await generate_gemini_content(
                request.message, request.context, request.apiKey, current_mode
            )
            
            latency_ms = (time.time() - start_time) * 1000
            quality = min(0.7 + (len(content) / 1000) * 0.2, 1.0)
            
            # Metrics
            token_counter.add(tokens, {"model": "gemini-pro", "mode": current_mode.value})
            cost_estimate_histogram.record(cost, {"model": "gemini-pro"})
            
            return {
                "content": content,
                "tokensUsed": tokens,
                "cost": cost,
                "latency": latency_ms,
                "quality": quality,
                "brownoutMode": current_mode.value,
                "model": "gemini-pro",
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Frontend Chat Error: {e}")
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/webhooks/datadog/brownout")
async def datadog_webhook(payload: DatadogWebhookPayload):
    logger.info(f"Received Datadog webhook: {payload}")
    
    if payload.alert_transition != 'Triggered':
         return {"status": "ignored", "reason": "Not a triggered alert"}

    # Extract mode from tags
    tags = payload.tags or []
    requested_mode = None
    for tag in tags:
        if tag.startswith("brownout:"):
            requested_mode = tag.split(":")[1]
            break
            
    if not requested_mode:
        return {"status": "ignored", "reason": "No brownout mode in tags"}
        
    try:
        new_mode = BrownoutMode(requested_mode)
        brownout_state.set_mode(new_mode)
        brownout_mode_counter.add(1, {"mode": new_mode.value, "source": "datadog_webhook"})
        
        logger.info(f"Brownout Mode set to {new_mode} by Datadog")
        
        return {
            "status": "success",
            "brownout_mode": new_mode.value,
            "alert_id": payload.alert_id,
            "timestamp": datetime.now().isoformat()
        }
    except ValueError:
        return {"status": "ignored", "reason": f"Invalid mode {requested_mode}"}

@app.get("/api/webhooks/datadog/brownout")
async def datadog_webhook_health():
    # Health check for the webhook path
    return {
        "status": "healthy",
        "current_mode": brownout_state.get_mode(),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/brownout")
async def get_brownout_status():
    return {
        "current_mode": brownout_state.get_mode(),
        "thresholds": brownout_state.get_thresholds(),
        "llm_config": {"model": "gemini-pro"},  # Mock config
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/brownout")
async def set_brownout_mode(data: BrownoutUpdateRequest):
    brownout_state.set_mode(data.mode)
    return {
        "status": "success",
        "previous_mode": "unknown", # simplified
        "new_mode": data.mode,
        "reason": data.reason or "Manual override",
        "timestamp": datetime.now().isoformat()
    }

@app.put("/api/brownout")
async def update_thresholds(data: ThresholdsUpdateRequest):
    brownout_state.update_thresholds(data.thresholds)
    return {
        "status": "success",
        "updated_thresholds": brownout_state.get_thresholds(),
        "timestamp": datetime.now().isoformat()
    }
