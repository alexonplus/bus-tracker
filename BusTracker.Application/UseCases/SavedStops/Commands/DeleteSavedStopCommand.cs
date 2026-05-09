using MediatR;

namespace BusTracker.Application.UseCases.SavedStops.Commands;

public record DeleteSavedStopCommand(int Id, int UserId)
    : IRequest<Unit>;
