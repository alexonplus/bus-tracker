using BusTracker.Application.DTOs;
using MediatR;

namespace BusTracker.Application.UseCases.Admin.Queries;

public record GetUsersQuery : IRequest<IReadOnlyList<UserDto>>;
