using BusTracker.Application.DTOs;
using MediatR;

namespace BusTracker.Application.UseCases.Events.Commands;

using BusTracker.Domain.Enums;

public record CreateEventCommand(
    string Title,
    string Description,
    DateTime EventDate,
    string StopId,
    string StopExtId,
    string StopName,
    string Address,
    EventCategory Category
) : IRequest<EventDto>;
