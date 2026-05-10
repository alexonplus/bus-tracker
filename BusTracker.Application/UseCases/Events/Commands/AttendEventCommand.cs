using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.Events.Commands;

public record AttendEventCommand(int EventId, int UserId, AttendanceStatus Status, int? Rating, bool LookingForCompany = false) : IRequest<Unit>;
