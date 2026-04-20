using BusTracker.Application.UseCases.SearchStops;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BusTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StopsController : ControllerBase
{
    private readonly IMediator _mediator;

    public StopsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest("Query is required");

        var stops = await _mediator.Send(new SearchStopsQuery(query));
        return Ok(stops);
    }
}
