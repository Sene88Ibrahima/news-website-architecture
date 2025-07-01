@echo off
echo Starting News Website Services...
echo.

echo Checking if services are already running...
netstat -an | find ":3000" >nul
if %errorlevel% == 0 (
    echo Warning: Port 3000 is already in use (Frontend)
)

netstat -an | find ":3001" >nul
if %errorlevel% == 0 (
    echo Warning: Port 3001 is already in use (Backend)
)

netstat -an | find ":8080" >nul
if %errorlevel% == 0 (
    echo Warning: Port 8080 is already in use (SOAP Service)
)

netstat -an | find ":8081" >nul
if %errorlevel% == 0 (
    echo Warning: Port 8081 is already in use (REST Service)
)

echo.
echo Starting services in separate windows...
echo.

echo Starting Backend (Port 3001)...
start "Backend Service" cmd /k "cd backend && npm run dev"

echo Starting REST Service (Port 8081)...
start "REST Service" cmd /k "cd rest-service && npm run dev"

echo Starting SOAP Service (Port 8080)...
start "SOAP Service" cmd /k "cd soap-service && npm run dev"

echo Starting Frontend (Port 3000)...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo All services are starting...
echo.
echo Service URLs:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:3001
echo - REST Service: http://localhost:8081
echo - SOAP Service: http://localhost:8080
echo - SOAP WSDL: http://localhost:8080/soap?wsdl
echo.
echo Press any key to exit this window...
pause >nul