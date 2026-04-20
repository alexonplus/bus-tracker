using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.GetDepartures;

public record GetDeparturesQuery(string StopExtId, int MaxDepartures = 20) : IRequest<List<Departure>>;
