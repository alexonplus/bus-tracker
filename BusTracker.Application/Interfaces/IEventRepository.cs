using BusTracker.Domain.Entities;

// Repository interfaces live in Application, not Domain — following Jason Taylor's Clean Architecture template.
namespace BusTracker.Application.Interfaces;

public interface IEventRepository
{
    Task<IReadOnlyList<Event>> GetUpcomingAsync(CancellationToken cancellationToken = default);
    Task<Event?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Event> CreateAsync(Event evt, CancellationToken cancellationToken = default);
    Task<Event> UpdateAsync(Event evt, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<EventAttendance?> GetAttendanceAsync(int eventId, int userId, CancellationToken cancellationToken = default);
    Task<EventAttendance> UpsertAttendanceAsync(EventAttendance attendance, CancellationToken cancellationToken = default);
}
