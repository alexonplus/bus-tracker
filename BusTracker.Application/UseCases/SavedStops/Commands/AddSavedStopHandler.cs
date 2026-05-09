using AutoMapper;
using BusTracker.Application.DTOs;
using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops.Commands;

public class AddSavedStopHandler : IRequestHandler<AddSavedStopCommand, SavedStopDto>
{
    private readonly ISavedStopRepository _repository;
    private readonly IMapper _mapper;

    public AddSavedStopHandler(ISavedStopRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<SavedStopDto> Handle(AddSavedStopCommand request, CancellationToken cancellationToken)
    {
        var savedStop = new SavedStop
        {
            UserId = request.UserId,
            StopId = request.StopId,
            StopExtId = request.StopExtId,
            StopName = request.StopName,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _repository.CreateAsync(savedStop, cancellationToken);
        return _mapper.Map<SavedStopDto>(created);
    }
}
