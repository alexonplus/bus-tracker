namespace BusTracker.API.Requests;

public record AddSavedStopRequest(int UserId, string StopId, string StopExtId, string StopName);
