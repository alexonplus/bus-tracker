namespace BusTracker.Domain.Entities;

public class Departure
{
    public string LineNumber { get; set; } = string.Empty;
    public string LineName { get; set; } = string.Empty;
    public string Direction { get; set; } = string.Empty;
    public string TransportCategory { get; set; } = string.Empty;
    public DateTime ScheduledTime { get; set; }
    public DateTime? RealtimeTime { get; set; }
    public string TripId { get; set; } = string.Empty;
    public string StopId { get; set; } = string.Empty;

    public bool IsDelayed => RealtimeTime.HasValue && RealtimeTime > ScheduledTime.AddMinutes(1);
    public DateTime DepartureTime => RealtimeTime ?? ScheduledTime;
    public int MinutesUntilDeparture => (int)Math.Max(0, (DepartureTime - DateTime.Now).TotalMinutes);
}
