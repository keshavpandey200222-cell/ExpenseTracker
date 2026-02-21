@echo off
echo Testing Registration Endpoint...
echo.

curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"

echo.
echo.
pause
