using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.SearchStops;

public class SearchStopsHandler : IRequestHandler<SearchStopsQuery, List<Stop>>
{
    private readonly IResRobotService _resRobotService;

    public SearchStopsHandler(IResRobotService resRobotService)
    {
        _resRobotService = resRobotService;
    }

    public Task<List<Stop>> Handle(SearchStopsQuery request, CancellationToken cancellationToken)
        => _resRobotService.SearchStopsAsync(request.Query);
}
