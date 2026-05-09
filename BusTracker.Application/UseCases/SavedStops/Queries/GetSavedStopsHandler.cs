using AutoMapper;
using BusTracker.Application.DTOs;
using BusTracker.Application.Interfaces;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops.Queries;

public class GetSavedStopsHandler : IRequestHandler<GetSavedStopsQuery, List<SavedStopDto>>
{
    private readonly ISavedStopRepository _repository;
    private readonly IMapper _mapper;

    public GetSavedStopsHandler(ISavedStopRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<List<SavedStopDto>> Handle(GetSavedStopsQuery request, CancellationToken cancellationToken)
    {
        var stops = await _repository.GetByUserIdAsync(request.UserId, cancellationToken);
        return _mapper.Map<List<SavedStopDto>>(stops);
    }
}
