using AutoMapper;
using BusTracker.Application.DTOs;
using BusTracker.Application.Interfaces;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops.Queries;

public class GetSavedStopByIdHandler : IRequestHandler<GetSavedStopByIdQuery, SavedStopDto>
{
    private readonly ISavedStopRepository _repository;
    private readonly IMapper _mapper;

    public GetSavedStopByIdHandler(ISavedStopRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<SavedStopDto> Handle(GetSavedStopByIdQuery request, CancellationToken cancellationToken)
    {
        var savedStop = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (savedStop == null)
            throw new KeyNotFoundException($"SavedStop with id {request.Id} not found");

        if (savedStop.UserId != request.UserId)
            throw new UnauthorizedAccessException("You do not own this stop");

        return _mapper.Map<SavedStopDto>(savedStop);
    }
}
