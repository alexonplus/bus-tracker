using BusTracker.Application.Interfaces;

namespace BusTracker.Application.UseCases.SavedStops.Commands;

public class UpdateSavedStopCommandValidator : IRequestValidator<UpdateSavedStopCommand>
{
    public Task<IEnumerable<string>> ValidateAsync(UpdateSavedStopCommand request, CancellationToken cancellationToken = default)
    {
        var errors = new List<string>();

        if (request.Id <= 0)
            errors.Add("Id must be greater than zero.");

        if (request.UserId <= 0)
            errors.Add("UserId must be greater than zero.");

        if (string.IsNullOrWhiteSpace(request.StopName))
            errors.Add("StopName is required.");

        return Task.FromResult<IEnumerable<string>>(errors);
    }
}
