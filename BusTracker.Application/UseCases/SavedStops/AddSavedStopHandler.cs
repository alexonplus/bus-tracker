using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops;

public class AddSavedStopHandler : IRequestHandler<AddSavedStopCommand, SavedStop>
{
    private readonly ISavedStopRepository _repository;

    public AddSavedStopHandler(ISavedStopRepository repository)
    {
        _repository = repository;
    }

    public async Task<SavedStop> Handle(AddSavedStopCommand request, CancellationToken cancellationToken)
    {
        var savedStop = new SavedStop
        {
            UserId = request.UserId,
            StopId = request.StopId,
            StopExtId = request.StopExtId,
            StopName = request.StopName,
            CreatedAt = DateTime.UtcNow
        };

        return await _repository.CreateAsync(savedStop, cancellationToken);
    }
}
