using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusTracker.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly BusTrackerDbContext _context;

    public UserRepository(BusTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
        => await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

    public async Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        => await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

    public async Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _context.Users
            .AsNoTracking()
            .OrderBy(u => u.Id)
            .ToListAsync(cancellationToken);

    public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default)
        => await _context.Users.AnyAsync(u => u.Email == email, cancellationToken);

    public async Task<User> CreateAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
        return user;
    }

    public async Task<User> UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);
        return user;
    }
}
