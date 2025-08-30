using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ProductManagement.API.Data;
using ProductManagement.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProductManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto login)
        {
            // Validate the user (you can add more sophisticated validation here)
            var user = _context.Users.FirstOrDefault(u => u.Username == login.Username && u.Password == login.Password);
            if (user == null) return Unauthorized();

            // Generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role) // Add the role as a claim
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);

            return Ok(new { Token = jwtToken });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto registerDto)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Username == registerDto.Username);
            if (existingUser != null) return BadRequest("Username already taken");

            var user = new User
            {
                Username = registerDto.Username,
                Password = registerDto.Password, // In production, hash the password before saving
                Role = registerDto.Role // Assign the role (Admin/User)
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("User registered successfully");
        }

        
    }
}
