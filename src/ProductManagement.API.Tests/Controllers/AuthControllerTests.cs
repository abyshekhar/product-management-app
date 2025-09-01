using Microsoft.EntityFrameworkCore;
using ProductManagement.API.Controllers;
using ProductManagement.API.Data;
using ProductManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Xunit;
namespace ProductManagement.API.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly AuthController _controller;
        private readonly AppDbContext _context;

        public AuthControllerTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")  // Use InMemoryDatabase for testing
                .Options;

            _context = new AppDbContext(options);

            // Seed initial data
            _context.Users.Add(new User { Username = "existinguser", Password = "hashedpassword123", Role = "User" });
            _context.SaveChanges();

            _controller = new AuthController(_context, new Microsoft.Extensions.Configuration.ConfigurationBuilder().Build());
        }

        [Fact]
        public void Register_ReturnsOkResult_WhenUserIsValid()
        {
            // Arrange
            var registerDto = new RegisterDto { Username = "testuser", Password = "password123", Role = "User" };

            // Act
            var result = _controller.Register(registerDto);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void Register_ReturnsBadRequest_WhenUserAlreadyExists()
        {
            // Arrange
            var registerDto = new RegisterDto { Username = "existinguser", Password = "password123", Role = "User" };

            // Act
            var result = _controller.Register(registerDto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}