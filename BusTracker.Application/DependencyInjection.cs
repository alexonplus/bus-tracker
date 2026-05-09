using AutoMapper;
using BusTracker.Application.Behaviors;
using BusTracker.Application.Interfaces;
using BusTracker.Application.Mappings;
using BusTracker.Application.UseCases.SavedStops.Commands;
using BusTracker.Application.UseCases.SavedStops.Queries;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace BusTracker.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));

        services.AddAutoMapper(typeof(MappingProfile));

        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        services.AddTransient<IRequestValidator<AddSavedStopCommand>, AddSavedStopCommandValidator>();
        services.AddTransient<IRequestValidator<UpdateSavedStopCommand>, UpdateSavedStopCommandValidator>();
        services.AddTransient<IRequestValidator<DeleteSavedStopCommand>, DeleteSavedStopCommandValidator>();
        services.AddTransient<IRequestValidator<GetSavedStopsQuery>, GetSavedStopsQueryValidator>();
        services.AddTransient<IRequestValidator<GetSavedStopByIdQuery>, GetSavedStopByIdQueryValidator>();

        return services;
    }
}
