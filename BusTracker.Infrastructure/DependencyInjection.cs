using BusTracker.Application.Interfaces;
using BusTracker.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using BusTracker.Infrastructure.Repositories;

namespace BusTracker.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration config)
    {
        services.AddHttpClient<IResRobotService, ResRobotService>();
        services.AddScoped<ITokenService, TokenService>();

        services.AddDbContext<BusTrackerDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection")));
        services.AddScoped<ISavedStopRepository, SavedStopRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IEventRepository, EventRepository>();

        return services;
    }
}