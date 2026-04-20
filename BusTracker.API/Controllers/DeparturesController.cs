using BusTracker.Application.UseCases.GetDepartures;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BusTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DeparturesController : ControllerBase
{
    private readonly IMediator _mediator;

    public DeparturesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string stopId, [FromQuery] int max = 20)
    {
        if (string.IsNullOrWhiteSpace(stopId))
            return BadRequest("stopId is required");

        var departures = await _mediator.Send(new GetDeparturesQuery(stopId, max));
        return Ok(departures);
    }
}
