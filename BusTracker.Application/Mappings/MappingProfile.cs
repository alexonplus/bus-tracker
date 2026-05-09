using AutoMapper;
using BusTracker.Application.DTOs;
using BusTracker.Domain.Entities;

namespace BusTracker.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<SavedStop, SavedStopDto>();
        CreateMap<User, UserDto>();
        CreateMap<Notification, NotificationDto>();
    }
}