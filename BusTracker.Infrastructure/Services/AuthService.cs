using BusTracker.Application.DTOs;
using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;

namespace BusTracker.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly IPasswordHasher _passwordHasher; //interface for password hashing

    public AuthService(
        IUserRepository userRepository, 
        ITokenService tokenService, 
        IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponseDto?> RegisterAsync(string name, string email, string password, CancellationToken cancellationToken)
    {
        if (await _userRepository.ExistsByEmailAsync(email, cancellationToken))
            return null;

        var user = new User 
        { 
            Name = name, 
            Email = email,
            PasswordHash = _passwordHasher.HashPassword(password) // Чистый вызов
        };

        var created = await _userRepository.CreateAsync(user, cancellationToken);
        var token = _tokenService.GenerateToken(created);

        return new AuthResponseDto(token);
    }

    public async Task<AuthResponseDto?> LoginAsync(string email, string password, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(email, cancellationToken);
        if (user is null)
            return null;

        //This is where we use the password hasher to verify the password
        if (!_passwordHasher.VerifyPassword(password, user.PasswordHash))
            return null;

        var token = _tokenService.GenerateToken(user);
        return new AuthResponseDto(token);
    }
}