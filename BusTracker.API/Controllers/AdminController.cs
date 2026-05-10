using BusTracker.API.Requests;
using BusTracker.Application.UseCases.Admin.Commands;
using BusTracker.Application.UseCases.Admin.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(CancellationToken cancellationToken)
        => Ok(await _mediator.Send(new GetUsersQuery(), cancellationToken));

    [HttpPut("users/{id}/role")]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] UpdateRoleRequest request, CancellationToken cancellationToken)
        => Ok(await _mediator.Send(new UpdateUserRoleCommand(id, request.Role), cancellationToken));
}
