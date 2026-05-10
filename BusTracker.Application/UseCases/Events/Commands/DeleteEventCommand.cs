using MediatR;

namespace BusTracker.Application.UseCases.Events.Commands;

public record DeleteEventCommand(int Id) : IRequest<Unit>;
