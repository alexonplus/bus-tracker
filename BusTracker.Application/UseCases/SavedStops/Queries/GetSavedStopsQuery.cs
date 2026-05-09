using BusTracker.Application.DTOs;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops.Queries;

public record GetSavedStopsQuery(int UserId) : IRequest<List<SavedStopDto>>;
