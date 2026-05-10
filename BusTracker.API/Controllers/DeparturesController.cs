using BusTracker.Application.UseCases.GetDepartures;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DeparturesController : ControllerBase
{
    private readonly IMediator _mediator;

    public DeparturesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetDepartures(
        [FromQuery] string stopId,
        [FromQuery] int max = 20,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(stopId))
            return BadRequest("stopId is required");

        var departures = await _mediator.Send(new GetDeparturesQuery(stopId, max), cancellationToken);
        return Ok(departures);
    }
}
