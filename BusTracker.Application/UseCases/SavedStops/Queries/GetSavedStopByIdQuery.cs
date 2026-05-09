using BusTracker.Application.DTOs;
using MediatR;

namespace BusTracker.Application.UseCases.SavedStops.Queries;

public record GetSavedStopByIdQuery(int Id, int UserId) : IRequest<SavedStopDto>;
