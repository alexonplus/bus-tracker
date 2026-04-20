using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.GetVehiclePositions;

public record GetVehiclePositionsQuery() : IRequest<List<Vehicle>>;
