using BusTracker.Domain.Entities;

namespace BusTracker.Application.Interfaces;

public interface IGtfsRealtimeService
{
    Task<List<Vehicle>> GetVehiclePositionsAsync();
}
