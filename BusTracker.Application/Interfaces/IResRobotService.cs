using BusTracker.Domain.Entities;

namespace BusTracker.Application.Interfaces;

public interface IResRobotService
{
    Task<List<Stop>> SearchStopsAsync(string query);
    Task<List<Departure>> GetDeparturesAsync(string stopExtId, int maxDepartures = 20);
}
