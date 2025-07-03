using System.Net;
using System.Text.Json;

namespace CourseManagementAPI.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            
            var response = new
            {
                success = false,
                message = "An error occurred while processing your request.",
                details = exception.Message
            };

            switch (exception)
            {
                case UnauthorizedAccessException:
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    response = new { success = false, message = "Unauthorized access.", details = exception.Message };
                    break;
                case ArgumentException:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response = new { success = false, message = exception.Message, details = exception.Message };
                    break;
                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            
            await context.Response.WriteAsync(jsonResponse);
        }
    }
}
