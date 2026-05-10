namespace BusTracker.Domain.Entities;

public enum AttendanceStatus { Going, NotGoing, Maybe }

public class EventAttendance
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public Event Event { get; set; } = null!;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public AttendanceStatus Status { get; set; }
    public int? Rating { get; set; }
    public bool LookingForCompany { get; set; }
    public DateTime CreatedAt { get; set; }
}
