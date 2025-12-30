#!/bin/bash

# OpenTelemetry Collector Setup Script for open-Balancer
# This script sets up the OpenTelemetry Collector with Datadog integration

set -e

echo "🚀 Setting up OpenTelemetry Collector for open-Balancer..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking required environment variables..."
    
    if [ -z "$DD_API_KEY" ]; then
        print_error "DD_API_KEY environment variable is not set"
        echo "Please set your Datadog API key:"
        echo "export DD_API_KEY=your_datadog_api_key"
        exit 1
    fi
    
    if [ -z "$DD_SITE" ]; then
        print_warning "DD_SITE not set, defaulting to datadoghq.com"
        export DD_SITE="datadoghq.com"
    fi
    
    print_success "Environment variables validated"
}

# Download OpenTelemetry Collector
download_collector() {
    print_status "Downloading OpenTelemetry Collector..."
    
    # Detect OS and architecture
    OS=$(uname -s | tr '[:upper:]' '[:lower:]')
    ARCH=$(uname -m)
    
    case $ARCH in
        x86_64) ARCH="amd64" ;;
        arm64|aarch64) ARCH="arm64" ;;
        *) print_error "Unsupported architecture: $ARCH"; exit 1 ;;
    esac
    
    # Set download URL
    VERSION="0.91.0"  # Update to latest stable version
    BINARY_NAME="otelcol-contrib"
    DOWNLOAD_URL="https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v${VERSION}/${BINARY_NAME}_${VERSION}_${OS}_${ARCH}.tar.gz"
    
    print_status "Downloading from: $DOWNLOAD_URL"
    
    # Create directory for collector
    mkdir -p ./otel-collector
    cd ./otel-collector
    
    # Download and extract
    curl -L -o collector.tar.gz "$DOWNLOAD_URL"
    tar -xzf collector.tar.gz
    chmod +x $BINARY_NAME
    
    print_success "OpenTelemetry Collector downloaded successfully"
    cd ..
}

# Validate configuration file
validate_config() {
    print_status "Validating OpenTelemetry Collector configuration..."
    
    if [ ! -f "otel-collector-config.yaml" ]; then
        print_error "Configuration file otel-collector-config.yaml not found"
        exit 1
    fi
    
    # Test configuration
    ./otel-collector/otelcol-contrib --config=otel-collector-config.yaml --dry-run
    
    if [ $? -eq 0 ]; then
        print_success "Configuration file is valid"
    else
        print_error "Configuration file validation failed"
        exit 1
    fi
}

# Start collector in background
start_collector() {
    print_status "Starting OpenTelemetry Collector..."
    
    # Stop any existing collector process
    pkill -f otelcol-contrib || true
    
    # Start collector in background
    nohup ./otel-collector/otelcol-contrib --config=otel-collector-config.yaml > otel-collector.log 2>&1 &
    COLLECTOR_PID=$!
    
    # Wait a moment for startup
    sleep 3
    
    # Check if process is running
    if kill -0 $COLLECTOR_PID 2>/dev/null; then
        print_success "OpenTelemetry Collector started successfully (PID: $COLLECTOR_PID)"
        echo $COLLECTOR_PID > otel-collector.pid
    else
        print_error "Failed to start OpenTelemetry Collector"
        cat otel-collector.log
        exit 1
    fi
}

# Test collector endpoints
test_endpoints() {
    print_status "Testing collector endpoints..."
    
    # Test health check
    if curl -f http://localhost:13133/ >/dev/null 2>&1; then
        print_success "Health check endpoint is responding"
    else
        print_warning "Health check endpoint not responding"
    fi
    
    # Test OTLP HTTP endpoint
    if curl -f http://localhost:4318/v1/traces >/dev/null 2>&1; then
        print_success "OTLP HTTP endpoint is responding"
    else
        print_warning "OTLP HTTP endpoint not responding"
    fi
    
    # Test metrics endpoint
    if curl -f http://localhost:8888/metrics >/dev/null 2>&1; then
        print_success "Metrics endpoint is responding"
    else
        print_warning "Metrics endpoint not responding"
    fi
}

# Create systemd service (optional)
create_service() {
    if [ "$1" = "--service" ]; then
        print_status "Creating systemd service..."
        
        CURRENT_DIR=$(pwd)
        SERVICE_FILE="/etc/systemd/system/open-balancer-otel.service"
        
        sudo tee $SERVICE_FILE > /dev/null <<EOF
[Unit]
Description=OpenTelemetry Collector for open-Balancer
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$CURRENT_DIR
ExecStart=$CURRENT_DIR/otel-collector/otelcol-contrib --config=$CURRENT_DIR/otel-collector-config.yaml
Restart=always
RestartSec=5
Environment=DD_API_KEY=$DD_API_KEY
Environment=DD_SITE=$DD_SITE

[Install]
WantedBy=multi-user.target
EOF
        
        sudo systemctl daemon-reload
        sudo systemctl enable open-balancer-otel
        sudo systemctl start open-balancer-otel
        
        print_success "Systemd service created and started"
    fi
}

# Main execution
main() {
    echo "🔧 OpenTelemetry Collector Setup for open-Balancer"
    echo "=================================================="
    
    check_env_vars
    download_collector
    validate_config
    start_collector
    test_endpoints
    create_service "$1"
    
    echo ""
    print_success "OpenTelemetry Collector setup completed!"
    echo ""
    echo "📊 Collector Status:"
    echo "   - Health Check: http://localhost:13133/"
    echo "   - Metrics: http://localhost:8888/metrics"
    echo "   - zPages: http://localhost:55679/debug/tracez"
    echo "   - Log file: otel-collector.log"
    echo "   - PID file: otel-collector.pid"
    echo ""
    echo "🔗 Datadog Integration:"
    echo "   - Site: $DD_SITE"
    echo "   - Service: open-balancer"
    echo "   - Check APM → Services in Datadog console"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Start your open-Balancer application"
    echo "   2. Generate some traffic"
    echo "   3. Check Datadog for incoming telemetry data"
    echo "   4. Configure detection rules for brownout triggers"
}

# Handle script arguments
case "$1" in
    --help|-h)
        echo "Usage: $0 [--service]"
        echo ""
        echo "Options:"
        echo "  --service    Create and start systemd service"
        echo "  --help       Show this help message"
        exit 0
        ;;
    *)
        main "$1"
        ;;
esac