using BusTracker.Application.Interfaces;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops;

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

        await _repository.DeleteAsync(request.Id, cancellationToken);
        return Unit.Value;
    }
}
