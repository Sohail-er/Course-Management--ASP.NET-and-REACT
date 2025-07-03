using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.DTOs
{
    public class UpdateCourseDto
    {
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
    }
}
