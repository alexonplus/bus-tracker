using BusTracker.API.Requests;
using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BusTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private static readonly PasswordHasher<User> _passwordHasher = new();

    public AuthController(IUserRepository userRepository, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        if (await _userRepository.ExistsByEmailAsync(request.Email, cancellationToken))
            return Conflict("Email already in use");

        var user = new User { Name = request.Name, Email = request.Email };
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        var created = await _userRepository.CreateAsync(user, cancellationToken);
        return CreatedAtAction(nameof(Register), new { token = _tokenService.GenerateToken(created) });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (user is null)
            return Unauthorized("Invalid credentials");

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
            return Unauthorized("Invalid credentials");

        return Ok(new { token = _tokenService.GenerateToken(user) });
    }
}
