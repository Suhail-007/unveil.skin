# Test script for Supabase Edge Functions
# Tests each function with sample requests

$env:PATH += ";$env:USERPROFILE\.deno\bin"

Write-Host "=== Supabase Edge Functions Test Suite ===" -ForegroundColor Cyan
Write-Host ""

# Function to test an endpoint
function Test-Function {
    param(
        [string]$Url,
        [string]$Body = "{}",
        [string]$Name
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    Write-Host "Body: $Body" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body $Body `
            -ErrorAction Stop
        
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor Green
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
        Write-Host ""
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

# Wait for user to start a function
Write-Host "Instructions:" -ForegroundColor Cyan
Write-Host "1. Open another terminal" -ForegroundColor White
Write-Host "2. Navigate to: supabase\functions" -ForegroundColor White
Write-Host "3. Run: .\run-local.ps1 get-users" -ForegroundColor White
Write-Host "4. Come back here and press Enter to test" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter when the function is running"

Write-Host ""
Write-Host "Testing get-users function..." -ForegroundColor Cyan
Test-Function -Url "http://localhost:8000" -Name "Get Users" -Body '{}'

Write-Host ""
Write-Host "To test other functions, start them with:" -ForegroundColor Yellow
Write-Host "  .\run-local.ps1 delete-user" -ForegroundColor Gray
Write-Host "  .\run-local.ps1 disable-user" -ForegroundColor Gray
Write-Host "  .\run-local.ps1 enable-user" -ForegroundColor Gray
Write-Host "  .\run-local.ps1 get-user-details" -ForegroundColor Gray
Write-Host ""
Write-Host "Example test requests:" -ForegroundColor Yellow
Write-Host '  delete-user:      {"userId": "123"}' -ForegroundColor Gray
Write-Host '  disable-user:     {"userId": "123"}' -ForegroundColor Gray
Write-Host '  enable-user:      {"userId": "123"}' -ForegroundColor Gray
Write-Host '  get-user-details: {"userId": "123"}' -ForegroundColor Gray
