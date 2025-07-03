using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CourseManagementAPI.Data;
using CourseManagementAPI.Models;
using CourseManagementAPI.DTOs;
using BCrypt.Net;

namespace CourseManagementAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return new AuthResponseDto { Success = false, Message = "Invalid credentials" };
            }

            if (!user.IsActive)
            {
                return new AuthResponseDto { Success = false, Message = "Account is inactive" };
            }

            // Check if the user's role matches the selected role
            if (!string.Equals(user.Role.ToString(), loginDto.Role, StringComparison.OrdinalIgnoreCase))
            {
                return new AuthResponseDto { Success = false, Message = "Incorrect role selected for this account." };
            }

            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Success = true,
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role.ToString()
                }
            };
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return new AuthResponseDto { Success = false, Message = "Email already exists" };
            }

            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = UserRole.User
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Success = true,
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role.ToString()
                }
            };
        }

        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured");
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer is not configured");
            var jwtAudience = _configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience is not configured");
            
            var key = Encoding.ASCII.GetBytes(jwtKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = jwtIssuer,
                Audience = jwtAudience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
