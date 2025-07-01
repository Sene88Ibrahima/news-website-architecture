#!/bin/bash

echo "Starting News Website Services..."
echo

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "Warning: Port $1 is already in use"
        return 1
    fi
    return 0
}

echo "Checking if services are already running..."
check_port 3000 && echo "Port 3000 (Frontend) is available"
check_port 5000 && echo "Port 5000 (Backend) is available"
check_port 8080 && echo "Port 8080 (SOAP Service) is available"
check_port 8081 && echo "Port 8081 (REST Service) is available"

echo
echo "Starting services..."
echo

# Function to start service in background
start_service() {
    local service_name=$1
    local directory=$2
    local command=$3
    local port=$4
    
    echo "Starting $service_name (Port $port)..."
    cd "$directory"
    $command &
    local pid=$!
    echo "$service_name started with PID $pid"
    cd ..
}

# Start all services
start_service "Backend" "backend" "npm run dev" "5000"
start_service "REST Service" "rest-service" "npm run dev" "8081"
start_service "SOAP Service" "soap-service" "npm run dev" "8080"
start_service "Frontend" "frontend" "npm start" "3000"

echo
echo "All services are starting..."
echo
echo "Service URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo "- REST Service: http://localhost:8081"
echo "- SOAP Service: http://localhost:8080"
echo "- SOAP WSDL: http://localhost:8080/soap?wsdl"
echo
echo "To stop all services, press Ctrl+C"
echo

# Wait for user interrupt
trap 'echo "\nStopping all services..."; kill $(jobs -p) 2>/dev/null; exit' INT

# Keep script running
while true; do
    sleep 1
done