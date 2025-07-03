using CourseManagementAPI.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace CourseManagementAPI.Data
{
    public static class SeedData
    {
        public static async Task Initialize(ApplicationDbContext context)
        {
            if (await context.Users.AnyAsync())
                return; // Database has been seeded

            // Create users
            var admin = new User
            {
                Name = "Admin User",
                Email = "admin@cms.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = UserRole.Admin
            };

            var instructor1 = new User
            {
                Name = "John Smith",
                Email = "instructor@cms.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Instructor@123"),
                Role = UserRole.Instructor,
                Specialization = "Web Development"
            };

            var instructor2 = new User
            {
                Name = "Jane Doe",
                Email = "jane.instructor@cms.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Instructor@123"),
                Role = UserRole.Instructor,
                Specialization = "Data Science"
            };

            var instructor3 = new User
            {
                Name = "Mike Johnson",
                Email = "mike.instructor@cms.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Instructor@123"),
                Role = UserRole.Instructor,
                Specialization = "Backend Development",
                IsActive = false
            };

            var user1 = new User
            {
                Name = "John Doe",
                Email = "user@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                Role = UserRole.User
            };

            var user2 = new User
            {
                Name = "Alice Johnson",
                Email = "alice@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                Role = UserRole.User
            };

            var user3 = new User
            {
                Name = "Bob Wilson",
                Email = "bob@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                Role = UserRole.User
            };

            context.Users.AddRange(admin, instructor1, instructor2, instructor3, user1, user2, user3);
            await context.SaveChangesAsync();

            // Create courses
            var course1 = new Course
            {
                Title = "Introduction to React",
                Description = "Learn the basics of React development including components, state, and props.",
                Category = "Web Development",
                Duration = "8 weeks",
                InstructorId = instructor1.Id
            };

            var course2 = new Course
            {
                Title = "Advanced JavaScript",
                Description = "Master advanced JavaScript concepts including closures, promises, and async/await.",
                Category = "Programming",
                Duration = "10 weeks",
                InstructorId = instructor2.Id
            };

            var course3 = new Course
            {
                Title = "Node.js Backend Development",
                Description = "Build scalable backend applications with Node.js and Express.",
                Category = "Backend",
                Duration = "12 weeks",
                InstructorId = instructor3.Id
            };

            var course4 = new Course
            {
                Title = "React Advanced Patterns",
                Description = "Master advanced React patterns and techniques for professional development.",
                Category = "Web Development",
                Duration = "6 weeks",
                InstructorId = instructor1.Id
            };

            context.Courses.AddRange(course1, course2, course3, course4);
            await context.SaveChangesAsync();

            // Create enrollments
            var enrollment1 = new Enrollment
            {
                UserId = user1.Id,
                CourseId = course1.Id
            };

            context.Enrollments.Add(enrollment1);
            await context.SaveChangesAsync();
        }
    }
}
