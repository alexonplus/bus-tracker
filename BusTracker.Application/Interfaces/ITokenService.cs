using BusTracker.Domain.Entities;

namespace BusTracker.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
}
