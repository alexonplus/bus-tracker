using BusTracker.API.Requests;
using BusTracker.Application.UseCases.SavedStops.Commands;
using BusTracker.Application.UseCases.SavedStops.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BusTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SavedStopsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SavedStopsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllSavedStops(CancellationToken cancellationToken)
    {
        var query = new GetAllSavedStopsQuery();
        var savedStops = await _mediator.Send(query, cancellationToken);
        return Ok(savedStops);
    }

    [HttpGet]
    public async Task<IActionResult> GetSavedStops(CancellationToken cancellationToken)
    {
        var query = new GetSavedStopsQuery(GetUserId());
        var savedStops = await _mediator.Send(query, cancellationToken);
        return Ok(savedStops);
    }

    [HttpPost]
    public async Task<IActionResult> AddSavedStop([FromBody] AddSavedStopRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.StopName) || string.IsNullOrWhiteSpace(request.StopId))
            return BadRequest("Invalid request");

        var command = new AddSavedStopCommand(GetUserId(), request.StopId, request.StopExtId, request.StopName);
        var savedStop = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetSavedStops), savedStop);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSavedStop(int id, [FromBody] UpdateSavedStopRequest request, CancellationToken cancellationToken)
    {
        if (id <= 0 || string.IsNullOrWhiteSpace(request.StopName))
            return BadRequest("Invalid request");

        try
        {
            var command = new UpdateSavedStopCommand(id, GetUserId(), request.StopName);
            var savedStop = await _mediator.Send(command, cancellationToken);
            return Ok(savedStop);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSavedStop(int id, CancellationToken cancellationToken)
    {
        if (id <= 0)
            return BadRequest("Invalid id");

        try
        {
            var command = new DeleteSavedStopCommand(id, GetUserId());
            await _mediator.Send(command, cancellationToken);
            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}
