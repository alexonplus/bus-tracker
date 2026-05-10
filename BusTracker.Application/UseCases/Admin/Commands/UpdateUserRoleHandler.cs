using BusTracker.Application.DTOs;
using BusTracker.Application.Interfaces;
using MediatR;

namespace BusTracker.Application.UseCases.Admin.Commands;

public class UpdateUserRoleHandler : IRequestHandler<UpdateUserRoleCommand, UserDto>
{
    private readonly IUserRepository _repository;

    public UpdateUserRoleHandler(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<UserDto> Handle(UpdateUserRoleCommand request, CancellationToken cancellationToken)
    {
        var user = await _repository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
            throw new KeyNotFoundException($"User with id {request.UserId} not found");

        user.Role = request.Role;
        var updated = await _repository.UpdateAsync(user, cancellationToken);

        return new UserDto { Id = updated.Id, Name = updated.Name, Email = updated.Email, Role = updated.Role };
    }
}
