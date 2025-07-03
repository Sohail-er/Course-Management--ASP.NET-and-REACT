using Microsoft.EntityFrameworkCore;
using CourseManagementAPI.Models;

namespace CourseManagementAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        private readonly ILogger<ApplicationDbContext> _logger;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ILogger<ApplicationDbContext> logger) 
            : base(options)
        {
            _logger = logger;
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            _logger.LogInformation("Configuring database model...");

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Role).HasConversion<string>();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValue(DateTime.UtcNow);
            });

            // Course configuration
            modelBuilder.Entity<Course>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Duration).IsRequired().HasMaxLength(50);
                entity.Property(e => e.CreatedAt).HasDefaultValue(DateTime.UtcNow);
                
                entity.HasOne(e => e.Instructor)
                      .WithMany(e => e.CoursesCreated)
                      .HasForeignKey(e => e.InstructorId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Enrollment configuration
            modelBuilder.Entity<Enrollment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.UserId, e.CourseId }).IsUnique();
                entity.Property(e => e.EnrolledAt).HasDefaultValue(DateTime.UtcNow);
                
                entity.HasOne(e => e.User)
                      .WithMany(e => e.Enrollments)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                      
                entity.HasOne(e => e.Course)
                      .WithMany(e => e.Enrollments)
                      .HasForeignKey(e => e.CourseId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            _logger.LogInformation("Database model configuration completed.");
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            _logger.LogDebug("Saving changes to database...");
            var result = await base.SaveChangesAsync(cancellationToken);
            _logger.LogDebug("Saved {Count} changes to database.", result);
            return result;
        }
    }
}
