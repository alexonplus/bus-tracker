using BusTracker.Application.DTOs;
using BusTracker.Application.Interfaces;
using BusTracker.Domain.Entities;
using MediatR;

namespace BusTracker.Application.UseCases.Events.Queries;

public class GetEventsHandler : IRequestHandler<GetEventsQuery, IReadOnlyList<EventDto>>
{
    private readonly IEventRepository _repository;

    public GetEventsHandler(IEventRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<EventDto>> Handle(GetEventsQuery request, CancellationToken cancellationToken)
    {
        var events = await _repository.GetUpcomingAsync(cancellationToken);
        return events.Select(e => MapToDto(e, request.UserId)).ToList();
    }

    private static EventDto MapToDto(Event e, int userId)
    {
        var attendances = e.Attendances ?? new List<EventAttendance>();
        var myAttendance = attendances.FirstOrDefault(a => a.UserId == userId);
        var ratings = attendances.Where(a => a.Rating.HasValue).Select(a => a.Rating!.Value).ToList();
        var counts = attendances.GroupBy(a => a.Status).ToDictionary(g => g.Key, g => g.Count());

        return new EventDto
        {
            Id = e.Id,
            Title = e.Title,
            Description = e.Description,
            EventDate = e.EventDate,
            StopId = e.StopId,
            StopExtId = e.StopExtId,
            StopName = e.StopName,
            Address = e.Address,
            Category = e.Category,
            GoingCount = counts.GetValueOrDefault(AttendanceStatus.Going),
            NotGoingCount = counts.GetValueOrDefault(AttendanceStatus.NotGoing),
            MaybeCount = counts.GetValueOrDefault(AttendanceStatus.Maybe),
            AverageRating = ratings.Any() ? Math.Round(ratings.Average(), 1) : null,
            MyStatus = myAttendance?.Status.ToString(),
            MyRating = myAttendance?.Rating,
            MyLookingForCompany = myAttendance?.LookingForCompany ?? false,
            SeekingCompany = attendances
                .Where(a => a.LookingForCompany && a.User != null)
                .Select(a => a.User!.Name)
                .ToList()
        };
    }
}
