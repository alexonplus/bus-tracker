using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.GetDepartures;

public class GetDeparturesHandler : IRequestHandler<GetDeparturesQuery, List<Departure>>
{
    private readonly IResRobotService _service;

    public GetDeparturesHandler(IResRobotService service)
    {
        _service = service;
    }

    public Task<List<Departure>> Handle(GetDeparturesQuery request, CancellationToken cancellationToken)
        => _service.GetDeparturesAsync(request.StopId, request.Max);
}
