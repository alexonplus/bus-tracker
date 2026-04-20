using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.SearchStops;

public record SearchStopsQuery(string Query) : IRequest<List<Stop>>;
