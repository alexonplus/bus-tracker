namespace BusTracker.Domain.Entities;

public class Stop
{
    public string Id { get; set; } = string.Empty;
    public string ExtId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}
