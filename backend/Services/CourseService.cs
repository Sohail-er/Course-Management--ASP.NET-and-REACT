using Microsoft.EntityFrameworkCore;
using CourseManagementAPI.Data;
using CourseManagementAPI.Models;
using CourseManagementAPI.DTOs;

namespace CourseManagementAPI.Services
{
    public class CourseService : ICourseService
    {
        private readonly ApplicationDbContext _context;

        public CourseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CourseDto>> GetAllCoursesAsync()
        {
            return await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Enrollments)
                .Where(c => c.IsActive)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Category = c.Category,
                    Duration = c.Duration,
                    Instructor = c.Instructor.Name,
                    InstructorId = c.InstructorId,
                    CreatedAt = c.CreatedAt,
                    EnrollmentCount = c.Enrollments.Count(e => e.IsActive)
                })
                .ToListAsync();
        }

        public async Task<CourseDto?> GetCourseByIdAsync(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Enrollments)
                .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

            if (course == null) return null;

            return new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Category = course.Category,
                Duration = course.Duration,
                Instructor = course.Instructor.Name,
                InstructorId = course.InstructorId,
                CreatedAt = course.CreatedAt,
                EnrollmentCount = course.Enrollments.Count(e => e.IsActive)
            };
        }

        public async Task<CourseDto> CreateCourseAsync(CreateCourseDto createCourseDto, int instructorId)
        {
            var course = new Course
            {
                Title = createCourseDto.Title,
                Description = createCourseDto.Description,
                Category = createCourseDto.Category,
                Duration = createCourseDto.Duration,
                InstructorId = instructorId
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            var instructor = await _context.Users.FindAsync(instructorId);

            return new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Category = course.Category,
                Duration = course.Duration,
                Instructor = instructor?.Name ?? "",
                InstructorId = course.InstructorId,
                CreatedAt = course.CreatedAt,
                EnrollmentCount = 0
            };
        }

        public async Task<bool> UpdateCourseAsync(int id, UpdateCourseDto updateCourseDto, int instructorId)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null || course.InstructorId != instructorId)
                return false;

            course.Title = updateCourseDto.Title;
            course.Description = updateCourseDto.Description;
            course.Category = updateCourseDto.Category;
            course.Duration = updateCourseDto.Duration;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCourseAsync(int id, int instructorId)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null || course.InstructorId != instructorId)
                return false;

            course.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EnrollUserAsync(int courseId, int userId)
        {
            var existingEnrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);

            if (existingEnrollment != null)
            {
                if (existingEnrollment.IsActive)
                    return false; // Already enrolled

                existingEnrollment.IsActive = true;
                existingEnrollment.EnrolledAt = DateTime.UtcNow;
            }
            else
            {
                var enrollment = new Enrollment
                {
                    UserId = userId,
                    CourseId = courseId
                };

                _context.Enrollments.Add(enrollment);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnenrollUserAsync(int courseId, int userId)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId && e.IsActive);

            if (enrollment == null)
                return false;

            enrollment.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
