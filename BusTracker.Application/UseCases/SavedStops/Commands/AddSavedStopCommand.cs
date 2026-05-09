using BusTracker.Application.DTOs;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops.Commands;

public record AddSavedStopCommand(int UserId, string StopId, string StopExtId, string StopName)
    : IRequest<SavedStopDto>;
