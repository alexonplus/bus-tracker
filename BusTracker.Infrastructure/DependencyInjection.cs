using BusTracker.Application.Interfaces;
using BusTracker.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BusTracker.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration config)
    {
        services.AddHttpClient<IResRobotService, ResRobotService>();
        services.AddHttpClient<IGtfsRealtimeService, GtfsRealtimeService>();

        services.AddDbContext<BusTrackerDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection")));

        return services;
    }
}