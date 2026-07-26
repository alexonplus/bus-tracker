using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace BusTracker.Infrastructure.Services;

public class IdentityPasswordHasher : IPasswordHasher
{
    private readonly PasswordHasher<User> _hasher = new();
    private readonly User _dummyUser = new(); // needed for the PasswordHasher methods, but not used for actual user data
    public string HashPassword(string password)
    {
        return _hasher.HashPassword(_dummyUser, password);
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        var result = _hasher.VerifyHashedPassword(_dummyUser, hashedPassword, password);
        return result != PasswordVerificationResult.Failed;
    }
}