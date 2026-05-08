using BusTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusTracker.Infrastructure;

public class BusTrackerDbContext : DbContext
{
    public BusTrackerDbContext(DbContextOptions<BusTrackerDbContext> options) 
        : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<SavedStop> SavedStops { get; set; }
    public DbSet<Notification> Notifications { get; set; }
}