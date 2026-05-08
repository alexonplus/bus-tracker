namespace BusTracker.Domain.Entities;

public class SavedStop
{
    public int Id { get; set; }
    public string StopId { get; set; } = string.Empty;
    public string StopName { get; set; } = string.Empty;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}