namespace BusTracker.Application.Interfaces;

public interface IRequestValidator<in TRequest> where TRequest : notnull
{
    Task<IEnumerable<string>> ValidateAsync(TRequest request, CancellationToken cancellationToken = default);
}
