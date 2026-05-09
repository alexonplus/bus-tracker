using BusTracker.Application.DTOs;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops.Commands;

public record UpdateSavedStopCommand(int Id, int UserId, string StopName)
    : IRequest<SavedStopDto>;
