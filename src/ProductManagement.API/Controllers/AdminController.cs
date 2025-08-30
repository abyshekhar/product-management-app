using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize(Policy = "AdminOnly")]
[Route("api/[controller]")]
[ApiController]
public class AdminController : ControllerBase
{
    // Only accessible by users with the "Admin" role
    public IActionResult Get()
    {
        return Ok("Hi Admin");
    }
}
