using AutoMapper;
using BusTracker.Application.DTOs;
using BusTracker.Application.Interfaces;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops.Queries;

public class GetAllSavedStopsHandler : IRequestHandler<GetAllSavedStopsQuery, IReadOnlyList<SavedStopDto>>
{
    private readonly ISavedStopRepository _repository;
    private readonly IMapper _mapper;

    public GetAllSavedStopsHandler(ISavedStopRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<SavedStopDto>> Handle(GetAllSavedStopsQuery request, CancellationToken cancellationToken)
    {
        var stops = await _repository.GetAllAsync(cancellationToken);
        return _mapper.Map<List<SavedStopDto>>(stops);
    }
}
