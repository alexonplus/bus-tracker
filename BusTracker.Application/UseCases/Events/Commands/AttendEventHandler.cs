using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.Events.Commands;

public class AttendEventHandler : IRequestHandler<AttendEventCommand, Unit>
{
    private readonly IEventRepository _repository;

    public AttendEventHandler(IEventRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(AttendEventCommand request, CancellationToken cancellationToken)
    {
        var attendance = new EventAttendance
        {
            EventId = request.EventId,
            UserId = request.UserId,
            Status = request.Status,
            Rating = request.Rating,
            LookingForCompany = request.LookingForCompany
        };

        await _repository.UpsertAttendanceAsync(attendance, cancellationToken);
        return Unit.Value;
    }
}
