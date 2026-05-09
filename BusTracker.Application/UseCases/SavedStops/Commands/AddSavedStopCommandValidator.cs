using BusTracker.Application.Interfaces;

namespace BusTracker.Application.UseCases.SavedStops.Commands;

public class AddSavedStopCommandValidator : IRequestValidator<AddSavedStopCommand>
{
    public Task<IEnumerable<string>> ValidateAsync(AddSavedStopCommand request, CancellationToken cancellationToken = default)
    {
        var errors = new List<string>();

        if (request.UserId <= 0)
            errors.Add("UserId must be greater than zero.");

        if (string.IsNullOrWhiteSpace(request.StopId))
            errors.Add("StopId is required.");

        if (string.IsNullOrWhiteSpace(request.StopName))
            errors.Add("StopName is required.");

        return Task.FromResult<IEnumerable<string>>(errors);
    }
}
