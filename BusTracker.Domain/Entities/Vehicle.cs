namespace BusTracker.Domain.Entities;

public class Vehicle
{
    public string TripId { get; set; } = string.Empty;
    public string RouteId { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public DateTime Timestamp { get; set; }
    public string VehicleId { get; set; } = string.Empty;
}
