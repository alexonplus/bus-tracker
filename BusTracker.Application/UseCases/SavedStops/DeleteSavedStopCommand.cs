using MediatR;

namespace BusTracker.Application.UseCases.SavedStops;

public record DeleteSavedStopCommand(int Id) 
    : IRequest<Unit>;
