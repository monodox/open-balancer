#!/bin/bash

# Stop OpenTelemetry Collector Script for open-Balancer

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

stop_collector() {
    print_status "Stopping OpenTelemetry Collector..."
    
    # Stop by PID file if it exists
    if [ -f "otel-collector.pid" ]; then
        PID=$(cat otel-collector.pid)
        if kill -0 $PID 2>/dev/null; then
            kill $PID
            print_success "Stopped collector process (PID: $PID)"
        else
            print_warning "Process with PID $PID not found"
        fi
        rm -f otel-collector.pid
    fi
    
    # Stop any remaining collector processes
    pkill -f otelcol-contrib && print_success "Stopped remaining collector processes" || print_warning "No collector processes found"
    
    # Stop systemd service if it exists
    if systemctl is-active --quiet open-balancer-otel 2>/dev/null; then
        sudo systemctl stop open-balancer-otel
        print_success "Stopped systemd service"
    fi
}

cleanup() {
    print_status "Cleaning up..."
    
    # Remove log file if requested
    if [ "$1" = "--clean" ]; then
        rm -f otel-collector.log
        print_success "Removed log file"
    fi
}

main() {
    echo "🛑 Stopping OpenTelemetry Collector for open-Balancer"
    echo "===================================================="
    
    stop_collector
    cleanup "$1"
    
    print_success "OpenTelemetry Collector stopped successfully!"
}

case "$1" in
    --help|-h)
        echo "Usage: $0 [--clean]"
        echo ""
        echo "Options:"
        echo "  --clean      Remove log files"
        echo "  --help       Show this help message"
        exit 0
        ;;
    *)
        main "$1"
        ;;
esac