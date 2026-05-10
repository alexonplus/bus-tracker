# BusTracker — запускает бэкенд и фронтенд одновременно
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\BusTracker.API'; dotnet run"
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\bus-tracker-frontend'; npm install; npm run dev"

Write-Host "Startar backend och frontend..." -ForegroundColor Cyan
Write-Host "Frontend oeppnas pa http://localhost:5173" -ForegroundColor Green
