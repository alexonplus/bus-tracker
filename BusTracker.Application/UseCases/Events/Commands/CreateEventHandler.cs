using AutoMapper;
using BusTracker.Application.DTOs;
using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.Events.Commands;

public class CreateEventHandler : IRequestHandler<CreateEventCommand, EventDto>
{
    private readonly IEventRepository _repository;
    private readonly IMapper _mapper;

    public CreateEventHandler(IEventRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<EventDto> Handle(CreateEventCommand request, CancellationToken cancellationToken)
    {
        var evt = new Event
        {
            Title = request.Title,
            Description = request.Description,
            EventDate = request.EventDate,
            StopId = request.StopId,
            StopExtId = request.StopExtId,
            StopName = request.StopName,
            Address = request.Address,
            Category = request.Category,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _repository.CreateAsync(evt, cancellationToken);
        return _mapper.Map<EventDto>(created);
    }
}
