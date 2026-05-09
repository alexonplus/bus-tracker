using BusTracker.Application.Interfaces;

namespace BusTracker.Application.UseCases.SavedStops.Queries;

public class GetSavedStopByIdQueryValidator : IRequestValidator<GetSavedStopByIdQuery>
{
    public Task<IEnumerable<string>> ValidateAsync(GetSavedStopByIdQuery request, CancellationToken cancellationToken = default)
    {
        var errors = new List<string>();

        if (request.Id <= 0)
            errors.Add("Id must be greater than zero.");

        if (request.UserId <= 0)
            errors.Add("UserId must be greater than zero.");

        return Task.FromResult<IEnumerable<string>>(errors);
    }
}
