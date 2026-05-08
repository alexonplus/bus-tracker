using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using BusTracker.Infrastructure;

namespace BusTracker.Infrastructure.Repositories;

public class SavedStopRepository : ISavedStopRepository
{
    private readonly BusTrackerDbContext _context;

    public SavedStopRepository(BusTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<SavedStop>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await _context.SavedStops
            .AsNoTracking()
            .Where(s => s.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<SavedStop?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.SavedStops
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    public async Task<SavedStop> CreateAsync(SavedStop savedStop, CancellationToken cancellationToken = default)
    {
        _context.SavedStops.Add(savedStop);
        await _context.SaveChangesAsync(cancellationToken);
        return savedStop;
    }

    public async Task<SavedStop> UpdateAsync(SavedStop savedStop, CancellationToken cancellationToken = default)
    {
        _context.SavedStops.Update(savedStop);
        await _context.SaveChangesAsync(cancellationToken);
        return savedStop;
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var savedStop = await _context.SavedStops.FindAsync(new object[] { id }, cancellationToken: cancellationToken);
        if (savedStop != null)
        {
            _context.SavedStops.Remove(savedStop);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
