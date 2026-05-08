using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops;

public record GetSavedStopsQuery(int UserId) : IRequest<IReadOnlyList<SavedStop>>;