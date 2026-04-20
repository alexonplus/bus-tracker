using BusTracker.Application.Interfaces;
using BusTracker.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace BusTracker.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        Microsoft.Extensions.Configuration.IConfiguration config)
    {
        services.AddHttpClient<IResRobotService, ResRobotService>();
        services.AddHttpClient<IGtfsRealtimeService, GtfsRealtimeService>();
        return services;
    }
}
