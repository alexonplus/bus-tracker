using BusTracker.Application.Interfaces;

namespace BusTracker.Application.UseCases.Events.Commands;

public class CreateEventCommandValidator : IRequestValidator<CreateEventCommand>
{
    public Task<IEnumerable<string>> ValidateAsync(CreateEventCommand request, CancellationToken cancellationToken = default)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Title))
            errors.Add("Title is required.");

        if (request.EventDate <= DateTime.UtcNow)
            errors.Add("Event date must be in the future.");

        if (string.IsNullOrWhiteSpace(request.StopExtId))
            errors.Add("Stop is required.");

        return Task.FromResult<IEnumerable<string>>(errors);
    }
}
