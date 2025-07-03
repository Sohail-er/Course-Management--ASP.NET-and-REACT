namespace CourseManagementAPI.DTOs
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public string Instructor { get; set; } = string.Empty;
        public int InstructorId { get; set; }
        public DateTime CreatedAt { get; set; }
        public int EnrollmentCount { get; set; }
    }
}
