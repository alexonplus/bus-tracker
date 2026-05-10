using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusTracker.Infrastructure.Repositories;

public class EventRepository : IEventRepository
{
    private readonly BusTrackerDbContext _context;

    public EventRepository(BusTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Event>> GetUpcomingAsync(CancellationToken cancellationToken = default)
        => await _context.Events
            .AsNoTracking()
            .Include(e => e.Attendances).ThenInclude(a => a.User)
            .Where(e => e.EventDate >= DateTime.UtcNow.AddMonths(-3))
            .OrderBy(e => e.EventDate)
            .ToListAsync(cancellationToken);

    public async Task<Event?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        => await _context.Events
            .Include(e => e.Attendances)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

    public async Task<Event> CreateAsync(Event evt, CancellationToken cancellationToken = default)
    {
        _context.Events.Add(evt);
        await _context.SaveChangesAsync(cancellationToken);
        return evt;
    }

    public async Task<Event> UpdateAsync(Event evt, CancellationToken cancellationToken = default)
    {
        _context.Events.Update(evt);
        await _context.SaveChangesAsync(cancellationToken);
        return evt;
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var evt = await _context.Events.FindAsync(new object[] { id }, cancellationToken);
        if (evt is not null)
        {
            _context.Events.Remove(evt);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<EventAttendance?> GetAttendanceAsync(int eventId, int userId, CancellationToken cancellationToken = default)
        => await _context.EventAttendances
            .FirstOrDefaultAsync(a => a.EventId == eventId && a.UserId == userId, cancellationToken);

    public async Task<EventAttendance> UpsertAttendanceAsync(EventAttendance attendance, CancellationToken cancellationToken = default)
    {
        var existing = await GetAttendanceAsync(attendance.EventId, attendance.UserId, cancellationToken);
        if (existing is null)
        {
            attendance.CreatedAt = DateTime.UtcNow;
            _context.EventAttendances.Add(attendance);
        }
        else
        {
            existing.Status = attendance.Status;
            existing.LookingForCompany = attendance.LookingForCompany;
            if (attendance.Rating.HasValue)
                existing.Rating = attendance.Rating;
        }
        await _context.SaveChangesAsync(cancellationToken);
        return existing ?? attendance;
    }
}
