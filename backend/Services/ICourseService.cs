using CourseManagementAPI.DTOs;

namespace CourseManagementAPI.Services
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseDto>> GetAllCoursesAsync();
        Task<CourseDto?> GetCourseByIdAsync(int id);
        Task<CourseDto> CreateCourseAsync(CreateCourseDto createCourseDto, int instructorId);
        Task<bool> UpdateCourseAsync(int id, UpdateCourseDto updateCourseDto, int instructorId);
        Task<bool> DeleteCourseAsync(int id, int instructorId);
        Task<bool> EnrollUserAsync(int courseId, int userId);
        Task<bool> UnenrollUserAsync(int courseId, int userId);
    }
}
