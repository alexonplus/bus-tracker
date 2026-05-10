namespace BusTracker.API.Requests;

public record AttendEventRequest(string Status, int? Rating, bool LookingForCompany = false);
