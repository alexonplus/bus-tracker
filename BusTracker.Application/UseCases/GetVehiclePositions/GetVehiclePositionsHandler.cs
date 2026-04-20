using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.GetVehiclePositions;

public class GetVehiclePositionsHandler : IRequestHandler<GetVehiclePositionsQuery, List<Vehicle>>
{
    private readonly IGtfsRealtimeService _gtfsService;

    public GetVehiclePositionsHandler(IGtfsRealtimeService gtfsService)
    {
        _gtfsService = gtfsService;
    }

    public Task<List<Vehicle>> Handle(GetVehiclePositionsQuery request, CancellationToken cancellationToken)
        => _gtfsService.GetVehiclePositionsAsync();
}
