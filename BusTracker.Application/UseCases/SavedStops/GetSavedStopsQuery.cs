using BusTracker.Application.DTOs;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops;

public record GetSavedStopsQuery(int UserId) : IRequest<List<SavedStopDto>>;