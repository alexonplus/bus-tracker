using BusTracker.API.Requests;
using BusTracker.Application.UseCases.SavedStops;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BusTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SavedStopsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SavedStopsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetSavedStops(int userId, CancellationToken cancellationToken)
    {
        if (userId <= 0)
            return BadRequest("userId must be greater than 0");

        var query = new GetSavedStopsQuery(userId);
        var savedStops = await _mediator.Send(query, cancellationToken);
        return Ok(savedStops);
    }

    [HttpPost]
    public async Task<IActionResult> AddSavedStop([FromBody] AddSavedStopRequest request, CancellationToken cancellationToken)
    {
        if (request.UserId <= 0 || string.IsNullOrWhiteSpace(request.StopName) || string.IsNullOrWhiteSpace(request.StopId))
            return BadRequest("Invalid request");

        var command = new AddSavedStopCommand(request.UserId, request.StopId, request.StopExtId, request.StopName);
        var savedStop = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetSavedStops), new { userId = savedStop.UserId }, savedStop);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSavedStop(int id, [FromBody] UpdateSavedStopRequest request, CancellationToken cancellationToken)
    {
        if (id <= 0 || string.IsNullOrWhiteSpace(request.StopName))
            return BadRequest("Invalid request");

        var command = new UpdateSavedStopCommand(id, request.StopName);
        var savedStop = await _mediator.Send(command, cancellationToken);
        return Ok(savedStop);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSavedStop(int id, CancellationToken cancellationToken)
    {
        if (id <= 0)
            return BadRequest("Invalid id");

        var command = new DeleteSavedStopCommand(id);
        await _mediator.Send(command, cancellationToken);
        return NoContent();
    }
}
