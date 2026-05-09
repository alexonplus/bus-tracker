using BusTracker.Application.DTOs;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops.Queries;

public record GetAllSavedStopsQuery : IRequest<List<SavedStopDto>>;
