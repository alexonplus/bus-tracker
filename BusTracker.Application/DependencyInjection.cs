using Microsoft.Extensions.DependencyInjection;
using BusTracker.Application.Mappings;

namespace BusTracker.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));
             services.AddAutoMapper(typeof(MappingProfile).Assembly);
        return services;
    }
}
