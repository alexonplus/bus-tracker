using BusTracker.Domain.Enums;

namespace BusTracker.Application.DTOs;

public class EventDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public string StopId { get; set; } = string.Empty;
    public string StopExtId { get; set; } = string.Empty;
    public string StopName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public EventCategory Category { get; set; }

    // Attendance stats
    public int GoingCount { get; set; }
    public int NotGoingCount { get; set; }
    public int MaybeCount { get; set; }
    public double? AverageRating { get; set; }

    // Current user's response (null if not responded)
    public string? MyStatus { get; set; }
    public int? MyRating { get; set; }
    public bool MyLookingForCompany { get; set; }

    // Names of users seeking company for this event
    public List<string> SeekingCompany { get; set; } = [];
}
