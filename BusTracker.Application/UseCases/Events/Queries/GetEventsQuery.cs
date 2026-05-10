using BusTracker.Application.DTOs;
using MediatR;

namespace BusTracker.Application.UseCases.Events.Queries;

public record GetEventsQuery(int UserId) : IRequest<IReadOnlyList<EventDto>>;
