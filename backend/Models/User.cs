using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public UserRole Role { get; set; }
        
        public string? Specialization { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<Course> CoursesCreated { get; set; } = new List<Course>();
        public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }

    public enum UserRole
    {
        Admin,
        Instructor,
        User
    }
}
