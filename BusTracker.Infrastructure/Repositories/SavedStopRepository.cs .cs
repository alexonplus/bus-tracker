using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusTracker.Infrastructure.Repositories;

public class SavedStopRepository : ISavedStopRepository
{
    private readonly BusTrackerDbContext _dbContext;

    public SavedStopRepository(BusTrackerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<SavedStop>> GetByUserIdAsync(int userId)
        => await _dbContext.SavedStops
            .Where(s => s.UserId == userId)
            .ToListAsync();

    public async Task<SavedStop?> GetByIdAsync(int id)
        => await _dbContext.SavedStops.FindAsync(id);

    public async Task<SavedStop> CreateAsync(SavedStop savedStop)
    {
        _dbContext.SavedStops.Add(savedStop);
        await _dbContext.SaveChangesAsync();
        return savedStop;
    }

    public async Task<SavedStop> UpdateAsync(SavedStop savedStop)
    {
        _dbContext.SavedStops.Update(savedStop);
        await _dbContext.SaveChangesAsync();
        return savedStop;
    }

    public async Task DeleteAsync(int id)
    {
        var savedStop = await _dbContext.SavedStops.FindAsync(id);
        if (savedStop != null)
        {
            _dbContext.SavedStops.Remove(savedStop);
            await _dbContext.SaveChangesAsync();
        }
    }
}