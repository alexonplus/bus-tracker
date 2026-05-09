namespace BusTracker.API.Requests;

public record AddSavedStopRequest(string StopId, string StopExtId, string StopName);
