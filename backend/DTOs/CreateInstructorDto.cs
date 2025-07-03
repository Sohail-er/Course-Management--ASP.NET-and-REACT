using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.DTOs
{
    public class CreateInstructorDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Specialization { get; set; } = string.Empty;
    }
}
