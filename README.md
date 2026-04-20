# BusTracker

Fullstack приложение для отслеживания автобусов в Гётеборге.

## Запуск

### Backend
```
cd BusTracker.API
dotnet run
```
API будет на http://localhost:5000

### Frontend
```
cd bus-tracker-frontend
npm install
npm run dev
```
Фронт будет на http://localhost:5173

## Структура
- **BusTracker.Domain** — сущности (Stop, Departure, Vehicle)
- **BusTracker.Application** — CQRS handlers (MediatR)
- **BusTracker.Infrastructure** — HTTP клиенты (ResRobot, GTFS-RT)
- **BusTracker.API** — ASP.NET Core Web API
- **bus-tracker-frontend** — Vite + React
