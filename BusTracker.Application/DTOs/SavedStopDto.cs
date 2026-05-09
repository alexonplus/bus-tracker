namespace BusTracker.Application.DTOs;

public class SavedStopDto
{
    public int Id { get; set; }
    public string StopId { get; set; } = string.Empty;
    public string StopExtId { get; set; } = string.Empty;
    public string StopName { get; set; } = string.Empty;
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
}