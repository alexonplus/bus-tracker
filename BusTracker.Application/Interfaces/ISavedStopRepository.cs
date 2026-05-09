using BusTracker.Domain.Entities;

// Repository interfaces live in Application, not Domain — following Jason Taylor's Clean Architecture template.
// Both placements are valid; Domain-side is also common in academic diagrams.
namespace BusTracker.Application.Interfaces;

public interface ISavedStopRepository
{
    Task<IReadOnlyList<SavedStop>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SavedStop>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task<SavedStop?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<SavedStop> CreateAsync(SavedStop savedStop, CancellationToken cancellationToken = default);
    Task<SavedStop> UpdateAsync(SavedStop savedStop, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}