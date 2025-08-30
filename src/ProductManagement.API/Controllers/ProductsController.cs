using Microsoft.AspNetCore.Mvc;
using ProductManagement.API.Models;
using ProductManagement.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace ProductManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // Temporary in-memory product list for now
        private static List<Product> products = new List<Product>
        {
            new Product { Id = 1, Name = "Product1", Description = "Description1", Price = 10.5M },
            new Product { Id = 2, Name = "Product2", Description = "Description2", Price = 15.0M }
        };

        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public IActionResult GetProduct(int id)
        {
            var product = products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
    }
}
