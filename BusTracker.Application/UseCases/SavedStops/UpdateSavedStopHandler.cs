using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops;

public class UpdateSavedStopHandler : IRequestHandler<UpdateSavedStopCommand, SavedStop>
{
    private readonly ISavedStopRepository _repository;

    public UpdateSavedStopHandler(ISavedStopRepository repository)
    {
        _repository = repository;
    }

    public async Task<SavedStop> Handle(UpdateSavedStopCommand request, CancellationToken cancellationToken)
    {
        var savedStop = await _repository.GetByIdAsync(request.Id, cancellationToken);
        
        if (savedStop == null)
            throw new KeyNotFoundException($"SavedStop with id {request.Id} not found");

        savedStop.StopName = request.StopName;
        savedStop.UpdatedAt = DateTime.UtcNow;

        return await _repository.UpdateAsync(savedStop, cancellationToken);
    }
}
