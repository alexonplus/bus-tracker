using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops;

public class GetSavedStopsHandler : IRequestHandler<GetSavedStopsQuery, IReadOnlyList<SavedStop>>
{
    private readonly ISavedStopRepository _repository;

    public GetSavedStopsHandler(ISavedStopRepository repository)
    {
        _repository = repository;
    }

    public Task<IReadOnlyList<SavedStop>> Handle(GetSavedStopsQuery request, CancellationToken cancellationToken)
        => _repository.GetByUserIdAsync(request.UserId, cancellationToken);
}