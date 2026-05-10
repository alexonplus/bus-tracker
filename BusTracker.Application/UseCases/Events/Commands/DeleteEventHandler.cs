using BusTracker.Application.Interfaces;
using MediatR;

namespace BusTracker.Application.UseCases.Events.Commands;

public class DeleteEventHandler : IRequestHandler<DeleteEventCommand, Unit>
{
    private readonly IEventRepository _repository;

    public DeleteEventHandler(IEventRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(DeleteEventCommand request, CancellationToken cancellationToken)
    {
        var evt = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (evt is null)
            throw new KeyNotFoundException($"Event with id {request.Id} not found");

        await _repository.DeleteAsync(request.Id, cancellationToken);
        return Unit.Value;
    }
}
