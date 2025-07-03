using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseManagementAPI.Data;
using CourseManagementAPI.Models;
using CourseManagementAPI.DTOs;
using System.Security.Claims;

namespace CourseManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CoursesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CoursesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetCourses()
        {
            var courses = await _context.Courses
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

            return Ok(courses);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<CourseDto>> GetCourse(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Enrollments)
                .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

            if (course == null)
            {
                return NotFound();
            }

            var courseDto = new CourseDto
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

            return Ok(courseDto);
        }

        [HttpPost]
        [Authorize(Roles = "Instructor")]
        public async Task<ActionResult<CourseDto>> CreateCourse(CreateCourseDto createCourseDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var course = new Course
            {
                Title = createCourseDto.Title,
                Description = createCourseDto.Description,
                Category = createCourseDto.Category,
                Duration = createCourseDto.Duration,
                InstructorId = userId,
                IsActive = true
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Course created: ID={course.Id}, Title={course.Title}, IsActive={course.IsActive}");

            var instructor = await _context.Users.FindAsync(userId);

            var courseDto = new CourseDto
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

            return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, courseDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> UpdateCourse(int id, UpdateCourseDto updateCourseDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
            {
                return NotFound();
            }

            if (course.InstructorId != userId)
            {
                return Forbid();
            }

            course.Title = updateCourseDto.Title;
            course.Description = updateCourseDto.Description;
            course.Category = updateCourseDto.Category;
            course.Duration = updateCourseDto.Duration;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
                return NotFound();

            if (course.InstructorId != userId)
                return Forbid();

            // HARD DELETE: Remove from DB
            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/enroll")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> EnrollInCourse(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var existingEnrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == id);

            if (existingEnrollment != null)
            {
                if (existingEnrollment.IsActive)
                {
                    return BadRequest("Already enrolled in this course");
                }
                
                existingEnrollment.IsActive = true;
                existingEnrollment.EnrolledAt = DateTime.UtcNow;
            }
            else
            {
                var enrollment = new Enrollment
                {
                    UserId = userId,
                    CourseId = id
                };

                _context.Enrollments.Add(enrollment);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}/unenroll")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> UnenrollFromCourse(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == id && e.IsActive);

            if (enrollment == null)
            {
                return NotFound("Enrollment not found");
            }

            enrollment.IsActive = false;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{id}/enrollment-status")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<object>> GetEnrollmentStatus(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == id && e.IsActive);
            
            return Ok(new { isEnrolled = enrollment != null });
        }

        [HttpGet("instructor/{instructorId}")]
        [Authorize(Roles = "Instructor")]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetCoursesByInstructor(int instructorId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            // Ensure the instructor can only see their own courses
            if (userId != instructorId)
            {
                return Forbid();
            }
            
            var courses = await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Enrollments)
                .Where(c => c.InstructorId == instructorId && c.IsActive)
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
            
            return Ok(courses);
        }

        [HttpGet("available")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetAvailableCourses()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var enrolledCourseIds = await _context.Enrollments
                .Where(e => e.UserId == userId && e.IsActive)
                .Select(e => e.CourseId)
                .ToListAsync();
            
            var availableCourses = await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Enrollments)
                .Where(c => c.IsActive && !enrolledCourseIds.Contains(c.Id))
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
            
            Console.WriteLine($"Available courses for user {userId}: {availableCourses.Count} courses");
            foreach (var course in availableCourses)
            {
                Console.WriteLine($"  - {course.Title} (ID: {course.Id})");
            }
            
            return Ok(availableCourses);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetAllCoursesForAdmin()
        {
            var courses = await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Enrollments)
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

            return Ok(courses);
        }
    }
}
