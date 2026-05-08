using BusTracker.Domain.Entities;

namespace BusTracker.Application.Interfaces;

public interface ISavedStopRepository
{
    Task<IReadOnlyList<SavedStop>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task<SavedStop?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<SavedStop> CreateAsync(SavedStop savedStop, CancellationToken cancellationToken = default);
    Task<SavedStop> UpdateAsync(SavedStop savedStop, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}