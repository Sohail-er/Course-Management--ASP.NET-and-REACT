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
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("profile")]
        public async Task<ActionResult<UserDto>> GetProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null)
            {
                return NotFound();
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role.ToString(),
                Specialization = user.Specialization,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };

            return Ok(userDto);
        }

        [HttpGet("instructors")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetInstructors()
        {
            var instructors = await _context.Users
                .Where(u => u.Role == UserRole.Instructor)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role.ToString(),
                    Specialization = u.Specialization,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(instructors);
        }

        [HttpGet("students")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetStudents()
        {
            var students = await _context.Users
                .Where(u => u.Role == UserRole.User)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role.ToString(),
                    Specialization = u.Specialization,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(students);
        }

        [HttpPost("instructors")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDto>> CreateInstructor(CreateInstructorDto createInstructorDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == createInstructorDto.Email))
            {
                return BadRequest("Email already exists");
            }

            var instructor = new User
            {
                Name = createInstructorDto.Name,
                Email = createInstructorDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Instructor@123"), // Default password
                Role = UserRole.Instructor,
                Specialization = createInstructorDto.Specialization
            };

            _context.Users.Add(instructor);
            await _context.SaveChangesAsync();

            var instructorDto = new UserDto
            {
                Id = instructor.Id,
                Name = instructor.Name,
                Email = instructor.Email,
                Role = instructor.Role.ToString(),
                Specialization = instructor.Specialization,
                IsActive = instructor.IsActive,
                CreatedAt = instructor.CreatedAt
            };

            return CreatedAtAction(nameof(GetProfile), instructorDto);
        }

        [HttpPut("instructors/{id}/toggle-status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleInstructorStatus(int id)
        {
            var instructor = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id && u.Role == UserRole.Instructor);

            if (instructor == null)
            {
                return NotFound();
            }

            instructor.IsActive = !instructor.IsActive;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("instructors/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteInstructor(int id)
        {
            var instructor = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id && u.Role == UserRole.Instructor);

            if (instructor == null)
            {
                return NotFound();
            }

            // Check if instructor has courses
            var hasCourses = await _context.Courses.AnyAsync(c => c.InstructorId == id);
            if (hasCourses)
            {
                return BadRequest("Cannot delete instructor with existing courses");
            }

            _context.Users.Remove(instructor);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("my-courses")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetMyCourses()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var enrolledCourses = await _context.Enrollments
                .Include(e => e.Course)
                .ThenInclude(c => c.Instructor)
                .Where(e => e.UserId == userId && e.IsActive && e.Course.IsActive)
                .Select(e => new CourseDto
                {
                    Id = e.Course.Id,
                    Title = e.Course.Title,
                    Description = e.Course.Description,
                    Category = e.Course.Category,
                    Duration = e.Course.Duration,
                    Instructor = e.Course.Instructor.Name,
                    InstructorId = e.Course.InstructorId,
                    CreatedAt = e.Course.CreatedAt,
                    EnrollmentCount = e.Course.Enrollments.Count(en => en.IsActive)
                })
                .ToListAsync();

            return Ok(enrolledCourses);
        }

        [HttpGet("enrolled-courses")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetEnrolledCourses()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var enrolledCourses = await _context.Enrollments
                .Include(e => e.Course)
                .ThenInclude(c => c.Instructor)
                .Where(e => e.UserId == userId && e.IsActive && e.Course.IsActive)
                .Select(e => new CourseDto
                {
                    Id = e.Course.Id,
                    Title = e.Course.Title,
                    Description = e.Course.Description,
                    Category = e.Course.Category,
                    Duration = e.Course.Duration,
                    Instructor = e.Course.Instructor.Name,
                    InstructorId = e.Course.InstructorId,
                    CreatedAt = e.Course.CreatedAt,
                    EnrollmentCount = e.Course.Enrollments.Count(en => en.IsActive)
                })
                .ToListAsync();

            return Ok(enrolledCourses);
        }

        [HttpGet("instructor-courses")]
        [Authorize(Roles = "Instructor")]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetInstructorCourses()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var instructorCourses = await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Enrollments)
                .Where(c => c.InstructorId == userId && c.IsActive)
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

            return Ok(instructorCourses);
        }
    }
}
