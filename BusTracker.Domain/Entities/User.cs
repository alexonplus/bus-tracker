namespace BusTracker.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public List<SavedStop> SavedStops { get; set; } = new();
    public List<Notification> Notifications { get; set; } = new();
}