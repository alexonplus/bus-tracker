using BusTracker.Domain.Entities;

// Repository interfaces live in Application, not Domain — following Jason Taylor's Clean Architecture template.
// Both placements are valid; Domain-side is also common in academic diagrams.
namespace BusTracker.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<User> CreateAsync(User user, CancellationToken cancellationToken = default);
}
