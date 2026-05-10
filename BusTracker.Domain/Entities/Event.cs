using BusTracker.Domain.Enums;

namespace BusTracker.Domain.Entities;

public class Event
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public string StopId { get; set; } = string.Empty;
    public string StopExtId { get; set; } = string.Empty;
    public string StopName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public EventCategory Category { get; set; } = EventCategory.Other;
    public DateTime CreatedAt { get; set; }
    public List<EventAttendance> Attendances { get; set; } = new();
}
