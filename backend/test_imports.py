
try:
    from fastapi import FastAPI
    print("FastAPI imported")
    import vertexai
    print("VertexAI imported")
    from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
    print("OTel Instrumentor imported")
except Exception as e:
    print(f"Error: {e}")
