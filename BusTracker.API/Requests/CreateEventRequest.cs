using BusTracker.Domain.Enums;

namespace BusTracker.API.Requests;

public record CreateEventRequest(
    string Title,
    string Description,
    DateTime EventDate,
    string StopId,
    string StopExtId,
    string StopName,
    string Address,
    EventCategory Category);
