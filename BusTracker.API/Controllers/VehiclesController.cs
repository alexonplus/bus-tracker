using BusTracker.Application.UseCases.GetVehiclePositions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BusTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly IMediator _mediator;

    public VehiclesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetPositions()
    {
        var vehicles = await _mediator.Send(new GetVehiclePositionsQuery());
        return Ok(vehicles);
    }
}
