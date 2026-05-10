using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.GetDepartures;

public record GetDeparturesQuery(string StopId, int Max = 20) : IRequest<List<Departure>>;
