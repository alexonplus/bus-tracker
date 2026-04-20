using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.GetDepartures;

public class GetDeparturesHandler : IRequestHandler<GetDeparturesQuery, List<Departure>>
{
    private readonly IResRobotService _resRobotService;

    public GetDeparturesHandler(IResRobotService resRobotService)
    {
        _resRobotService = resRobotService;
    }

    public Task<List<Departure>> Handle(GetDeparturesQuery request, CancellationToken cancellationToken)
        => _resRobotService.GetDeparturesAsync(request.StopExtId, request.MaxDepartures);
}
