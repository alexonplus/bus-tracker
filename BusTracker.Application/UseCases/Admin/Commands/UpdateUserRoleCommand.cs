using BusTracker.Application.DTOs;
using BusTracker.Domain.Enums;
using MediatR;

namespace BusTracker.Application.UseCases.Admin.Commands;

public record UpdateUserRoleCommand(int UserId, UserRole Role) : IRequest<UserDto>;
