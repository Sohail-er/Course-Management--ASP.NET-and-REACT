using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.Models
{
    public class Course
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Category { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Duration { get; set; } = string.Empty;
        
        public int InstructorId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public virtual User Instructor { get; set; } = null!;
        public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}
