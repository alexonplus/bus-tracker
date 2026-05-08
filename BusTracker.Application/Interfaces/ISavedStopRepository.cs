using BusTracker.Domain.Entities;

namespace BusTracker.Application.Interfaces;

public interface ISavedStopRepository
{
    Task<List<SavedStop>> GetByUserIdAsync(int userId);
    Task<SavedStop?> GetByIdAsync(int id);
    Task<SavedStop> CreateAsync(SavedStop savedStop);
    Task<SavedStop> UpdateAsync(SavedStop savedStop);
    Task DeleteAsync(int id);
}