# BusTracker

A real-time public transit app for Gothenburg, built as a school assignment (inlämningsuppgift). Covers stop search, live departures, event planning with RSVP, trip routing, and an admin panel.

## Tech Stack

**Backend** — ASP.NET Core 9, Clean Architecture (4 layers), CQRS with MediatR, JWT authentication with role-based access control (RBAC), Entity Framework Core + SQL Server LocalDB, AutoMapper, ResRobot v2.1 API.

**Frontend** — React 18 + Vite, Framer Motion, react-router-dom, Axios, OpenStreetMap + Nominatim geocoding, Open-Meteo weather API.

## Architecture

```
BusTracker.Domain          →  Entities, Enums — no external dependencies
BusTracker.Application     →  CQRS use cases, DTOs, Interfaces, ValidationBehavior pipeline
BusTracker.Infrastructure  →  EF Core, Repositories, ResRobot service, JWT service, DB Seeder
BusTracker.API             →  Thin controllers, Program.cs, Request models
bus-tracker-frontend/      →  React SPA proxied to the API via Vite
```

## Features

- **Stop search** — live search against ResRobot, save favourite stops per user
- **Departure board** — real-time departures with delay indicator
- **Events** — admins create events with category, date and stop; users RSVP (Going / Maybe / Not going) and rate after attending (1–5 ⭐)
- **Looking for company** — toggle on an event to signal you want travel companions; visible to everyone
- **Trip planner** — pick a departure stop, ResRobot plans the journey to the event stop
- **Reminder widget** — persisted in localStorage, shown on all pages; pulses red on the event day; shows ☂ if rain is forecast (Open-Meteo, within 7 days only)
- **Admin panel** — manage user roles, create and delete events

## Getting Started

```bash
# Backend — requires .NET 9 SDK
cd BusTracker.API
dotnet run

# Frontend — requires Node 18+
cd bus-tracker-frontend
npm install
npm run dev
```

The app is available at `http://localhost:5173` (or the next free port). The API runs on `https://localhost:7xxx`.

## Secrets (user secrets)

```json
{
  "Jwt:Key": "<at least 32 characters>",
  "Trafiklab:ResRobotKey": "<your ResRobot API key>"
}
```

## Design Patterns Demonstrated

| Pattern | Where |
|---------|-------|
| Clean Architecture | Strict layer boundaries; Domain has zero dependencies |
| CQRS with MediatR | Every use case is an `IRequest<T>` handler; controllers contain no business logic |
| Pipeline Behaviour | `ValidationBehavior<TRequest>` runs custom `IRequestValidator<T>` before every command |
| Repository Pattern | `IEventRepository`, `ISavedStopRepository`, `IUserRepository` |
| JWT + RBAC | `[Authorize(Roles = "Admin")]` on admin endpoints; role stored as a claim |
