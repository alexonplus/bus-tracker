using BusTracker.Application.Common.Exceptions;
using BusTracker.Application.Interfaces;
using MediatR;

namespace BusTracker.Application.Behaviors;

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IEnumerable<IRequestValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IRequestValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var errors = new List<string>();

        foreach (var validator in _validators)
        {
            var result = await validator.ValidateAsync(request, cancellationToken);
            if (result != null)
                errors.AddRange(result.Where(x => !string.IsNullOrWhiteSpace(x)));
        }

        if (errors.Any())
            throw new RequestValidationException(errors);

        return await next();
    }
}
