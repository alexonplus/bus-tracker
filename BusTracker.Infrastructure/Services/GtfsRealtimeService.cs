using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace BusTracker.Infrastructure.Services;

public class GtfsRealtimeService : IGtfsRealtimeService
{
    public GtfsRealtimeService(HttpClient http, IConfiguration config) { }

    public Task<List<Vehicle>> GetVehiclePositionsAsync()
    {
        // TODO: подключить позже через Google.Protobuf
        return Task.FromResult(new List<Vehicle>());
    }
}