using BusTracker.Application.Interfaces;

namespace BusTracker.Application.UseCases.SavedStops.Queries;

public class GetSavedStopsQueryValidator : IRequestValidator<GetSavedStopsQuery>
{
    public Task<IEnumerable<string>> ValidateAsync(GetSavedStopsQuery request, CancellationToken cancellationToken = default)
    {
        var errors = new List<string>();

        if (request.UserId <= 0)
            errors.Add("UserId must be greater than zero.");

        return Task.FromResult<IEnumerable<string>>(errors);
    }
}
