using BusTracker.Domain.Enums;

namespace BusTracker.Application.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    // PasswordHash — never included in DTO for security reasons
}
