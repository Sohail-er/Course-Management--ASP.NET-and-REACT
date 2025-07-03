using CourseManagementAPI.Models;
using CourseManagementAPI.DTOs;

namespace CourseManagementAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        string GenerateJwtToken(User user);
    }
}
