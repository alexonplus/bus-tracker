using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops;

public record UpdateSavedStopCommand(int Id, string StopName) 
    : IRequest<SavedStop>;
