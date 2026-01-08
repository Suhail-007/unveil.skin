# Script to run Supabase Edge Functions locally with Deno
# Usage: .\run-local.ps1 <function-name> [port]

param(
    [Parameter(Mandatory=$true)]
    [string]$FunctionName,
    
    [Parameter(Mandatory=$false)]
    [int]$Port = 8000
)

# Ensure Deno is in PATH
$env:PATH += ";$env:USERPROFILE\.deno\bin"

# Available functions
$functions = @(
    "get-users",
    "delete-user", 
    "disable-user",
    "enable-user",
    "get-user-details"
)

if ($functions -notcontains $FunctionName) {
    Write-Host "Error: Unknown function '$FunctionName'" -ForegroundColor Red
    Write-Host "Available functions:" -ForegroundColor Yellow
    $functions | ForEach-Object { Write-Host "  - $_" }
    exit 1
}

$functionPath = ".\$FunctionName\index.ts"

if (-not (Test-Path $functionPath)) {
    Write-Host "Error: Function file not found: $functionPath" -ForegroundColor Red
    exit 1
}

Write-Host "Starting function: $FunctionName on port $Port" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Run the function
deno run --allow-net --allow-env --env-file=.env.local $functionPath
