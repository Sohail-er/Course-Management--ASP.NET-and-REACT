using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CourseManagementAPI.Data;
using CourseManagementAPI.Services;
using CourseManagementAPI.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework with MySQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 21)));
    
    // Enable sensitive data logging in development
    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    }
});

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured");
        var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer is not configured");
        var jwtAudience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience is not configured");
        
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add custom services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICourseService, CourseService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Course Management API V1");
        c.RoutePrefix = "swagger";
    });
}

// Add error handling middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();
app.UseCors("ReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Database initialization and seeding
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Ensure database is created
        logger.LogInformation("Ensuring database is created...");
        await context.Database.EnsureCreatedAsync();
        
        // Apply any pending migrations
        logger.LogInformation("Applying migrations...");
        await context.Database.MigrateAsync();
        
        // Seed initial data
        logger.LogInformation("Seeding database...");
        await SeedData.Initialize(context);
        
        logger.LogInformation("Database initialization completed successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while initializing the database.");
        throw;
    }
}

app.Run();
