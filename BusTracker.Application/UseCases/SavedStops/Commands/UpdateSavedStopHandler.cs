using AutoMapper;
using BusTracker.Application.DTOs;
using BusTracker.Application.Interfaces;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops.Commands;

public class UpdateSavedStopHandler : IRequestHandler<UpdateSavedStopCommand, SavedStopDto>
{
    private readonly ISavedStopRepository _repository;
    private readonly IMapper _mapper;

    public UpdateSavedStopHandler(ISavedStopRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<SavedStopDto> Handle(UpdateSavedStopCommand request, CancellationToken cancellationToken)
    {
        var savedStop = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (savedStop == null)
            throw new KeyNotFoundException($"SavedStop with id {request.Id} not found");

        if (savedStop.UserId != request.UserId)
            throw new UnauthorizedAccessException("You do not own this stop");

        savedStop.StopName = request.StopName;
        savedStop.UpdatedAt = DateTime.UtcNow;

        var updated = await _repository.UpdateAsync(savedStop, cancellationToken);
        return _mapper.Map<SavedStopDto>(updated);
    }
}
