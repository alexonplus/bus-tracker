using BusTracker.Application.UseCases.Events.Commands;
using BusTracker.Application.UseCases.Events.Queries;
using BusTracker.Domain.Entities;
using BusTracker.Domain.Enums;
using BusTracker.API.Requests;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BusTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EventsController : ControllerBase
{
    private readonly IMediator _mediator;

    public EventsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetEvents(CancellationToken cancellationToken)
        => Ok(await _mediator.Send(new GetEventsQuery(GetUserId()), cancellationToken));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequest request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new CreateEventCommand(
            request.Title, request.Description, request.EventDate,
            request.StopId, request.StopExtId, request.StopName,
            request.Address, request.Category), cancellationToken);
        return CreatedAtAction(nameof(GetEvents), result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteEvent(int id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteEventCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPost("{id}/attend")]
    public async Task<IActionResult> SetAttendance(int id, [FromBody] AttendEventRequest request, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<AttendanceStatus>(request.Status, true, out var status))
            return BadRequest("Invalid status. Use: Going, NotGoing, Maybe");

        await _mediator.Send(new AttendEventCommand(id, GetUserId(), status, request.Rating, request.LookingForCompany), cancellationToken);
        return Ok();
    }
}
