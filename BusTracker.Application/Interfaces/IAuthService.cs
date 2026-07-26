using System.Threading;
using System.Threading.Tasks;
using BusTracker.Application.DTOs;


namespace BusTracker.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> RegisterAsync(string name, string email, string password, CancellationToken cancellationToken);
    Task<AuthResponseDto?> LoginAsync(string email, string password, CancellationToken cancellationToken);
}