namespace CourseManagementAPI.Models
{
    public class Enrollment
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        public int CourseId { get; set; }
        
        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
        
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Course Course { get; set; } = null!;
    }
}
