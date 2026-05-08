using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops;

public record AddSavedStopCommand(int UserId, string StopId, string StopExtId, string StopName) 
    : IRequest<SavedStop>;
