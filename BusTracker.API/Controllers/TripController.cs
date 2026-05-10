using BusTracker.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TripController : ControllerBase
{
    private readonly IResRobotService _resRobotService;

    public TripController(IResRobotService resRobotService)
    {
        _resRobotService = resRobotService;
    }

    [HttpGet]
    public async Task<IActionResult> PlanTrip(
        [FromQuery] string fromExtId,
        [FromQuery] string toExtId,
        [FromQuery] DateTime dateTime,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(fromExtId) || string.IsNullOrWhiteSpace(toExtId))
            return BadRequest("fromExtId and toExtId are required");

        if (fromExtId == toExtId)
            return BadRequest("Departure and destination stops cannot be the same");

        try
        {
            var result = await _resRobotService.PlanTripAsync(fromExtId, toExtId, dateTime, cancellationToken);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(502, new { error = "Could not reach trip planner", detail = ex.Message });
        }
    }
}
