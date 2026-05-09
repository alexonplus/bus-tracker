using BusTracker.Application.Interfaces;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops.Commands;

public class DeleteSavedStopHandler : IRequestHandler<DeleteSavedStopCommand, Unit>
{
    private readonly ISavedStopRepository _repository;

    public DeleteSavedStopHandler(ISavedStopRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(DeleteSavedStopCommand request, CancellationToken cancellationToken)
    {
        var savedStop = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (savedStop == null)
            throw new KeyNotFoundException($"SavedStop with id {request.Id} not found");

        if (savedStop.UserId != request.UserId)
            throw new UnauthorizedAccessException("You do not own this stop");

        await _repository.DeleteAsync(request.Id, cancellationToken);
        return Unit.Value;
    }
}
