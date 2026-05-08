using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace BusTracker.Infrastructure.Services;

public class GtfsRealtimeService : IGtfsRealtimeService
{
    public GtfsRealtimeService(HttpClient http, IConfiguration config) { }

    public Task<List<Vehicle>> GetVehiclePositionsAsync()
    {
        // TODO: Implement GTFS Realtime fetching and parsing logic
        return Task.FromResult(new List<Vehicle>());
    }
}