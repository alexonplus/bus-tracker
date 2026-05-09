namespace BusTracker.Application.Common.Exceptions;

public class RequestValidationException : Exception
{
    public IReadOnlyList<string> Errors { get; }

    public RequestValidationException(IEnumerable<string> errors)
        : base("Request validation failed")
    {
        Errors = errors.Distinct().ToList();
    }
}
