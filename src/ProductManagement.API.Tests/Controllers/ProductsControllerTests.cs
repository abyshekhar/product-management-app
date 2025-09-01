using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ProductManagement.API.Controllers;
using ProductManagement.API.Data;
using ProductManagement.API.Models;
using ProductManagement.API.Tests.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using System.Diagnostics;

namespace ProductManagement.API.Tests.Controllers
{
    public class ProductsControllerTests
    {
        private ProductsController GetController(AppDbContext context)
        {
            return new ProductsController(context);
        }

        [Fact]
        public async Task CreateProduct_WithValidData_ReturnsCreatedProduct()
        {
            // Arrange
            var context = TestDbContextFactory.CreateInMemoryDbContext("CreateProductDb");

            // We need a category to associate with the product.
            var category = new Category { Name = "Test Category" };
            context.Categories.Add(category);
            await context.SaveChangesAsync();

            var controller = GetController(context);

            var createProductDto = new CreateProductDto
            {
                Name = "New Test Product",
                Description = "A description for the test product.",
                Price = 99.99m,
                CategoryId = category.Id
            };

            // Act
            var result = await controller.CreateProduct(createProductDto);

            // Assert
            // The controller should return a CreatedAtActionResult on success
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedProductDto = Assert.IsType<ProductDto>(createdAtActionResult.Value);

            // Verify that the DTO's properties match the input
            Assert.Equal(createProductDto.Name, returnedProductDto.Name);
            Assert.Equal(createProductDto.Price, returnedProductDto.Price);
            Assert.Equal(category.Name, returnedProductDto.CategoryName);

            // Verify that the product was saved to the database
            var savedProduct = await context.Products.FirstOrDefaultAsync(p => p.Id == returnedProductDto.Id);
            Assert.NotNull(savedProduct);
            Assert.Equal(createProductDto.Name, savedProduct.Name);
        }

        [Fact]
        public async Task GetProducts_WhenCalled_ReturnsAllProducts()
        {
            // Arrange
            var context = TestDbContextFactory.CreateInMemoryDbContext("GetProductsDb");

            // Create a dummy category to associate with the products
            var dummyCategory = new Category { Id = 1, Name = "Dummy Category" };
            context.Categories.Add(dummyCategory);

            // Add products and link them to the category
            context.Products.AddRange(new List<Product>
    {
        new Product { Name = "Product 1", Description = "Desc 1", Price = 10, CategoryId = dummyCategory.Id, Category = dummyCategory },
        new Product { Name = "Product 2", Description = "Desc 2", Price = 20, CategoryId = dummyCategory.Id, Category = dummyCategory }
    });
            await context.SaveChangesAsync();

            // The test requires an HTTP context to handle the Response.Headers, so we need to mock it.
            var controller = GetController(context);

            // **ADD THIS BLOCK**
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.GetProducts(null, null, null, null, 1, 10);

            // Assert
            // The controller returns ActionResult<IEnumerable<ProductDto>>
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var productsDto = Assert.IsType<List<ProductDto>>(okResult.Value);

            // Check if the correct number of products were returned
            Assert.Equal(2, productsDto.Count);

            // Verify the data in the DTO
            Assert.Equal("Product 1", productsDto[0].Name);
            Assert.Equal("Dummy Category", productsDto[0].CategoryName);
            Assert.Equal("Product 2", productsDto[1].Name);
            Assert.Equal("Dummy Category", productsDto[1].CategoryName);
        }

        [Fact]
        public async Task GetProduct_ExistingId_ReturnsProduct()
        {
            // Arrange
            var context = TestDbContextFactory.CreateInMemoryDbContext("GetProductDb");
            // Add a category to the database first
            var dummyCategory = new Category { Id = 1, Name = "Dummy Category" };
            context.Categories.Add(dummyCategory);
            var product = new Product { Name = "Single Product", Description = "Desc", Price = 50, CategoryId = dummyCategory.Id, Category = dummyCategory };
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var controller = GetController(context);
            Debug.WriteLine("Product ID is "+product.Id);
            // Act
            var result = await controller.GetProductById(product.Id);

            // Assert
            // Check that the result is an OkObjectResult
            var okResult = Assert.IsType<OkObjectResult>(result.Result);

            // Check that the value of the result is a ProductDto
            var returnedProductDto = Assert.IsType<ProductDto>(okResult.Value);

            // Verify the data in the DTO
            Assert.Equal("Single Product", returnedProductDto.Name);
            Assert.Equal("Dummy Category", returnedProductDto.CategoryName);
        }

        [Fact]
        public async Task GetProduct_NonExistingId_ReturnsNotFound()
        {
            var context = TestDbContextFactory.CreateInMemoryDbContext("GetProductNotFoundDb");
            var controller = GetController(context);

            var result = await controller.GetProductById(999);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task UpdateProduct_ValidData_ReturnsNoContent()
        {
            var context = TestDbContextFactory.CreateInMemoryDbContext("UpdateProductDb");
            var product = new Product { Name = "Old Name", Description = "Old Desc", Price = 100, CategoryId = 1 };
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var controller = GetController(context);

            var updateDto = new UpdateProductDto
            {
                Name = "Updated Name",
                Description = product.Description,
                Price = product.Price,
                CategoryId = product.CategoryId
            };

            var result = await controller.UpdateProduct(product.Id, updateDto);

            Assert.IsType<NoContentResult>(result);

            var updatedProduct = await context.Products.FindAsync(product.Id);
            Assert.Equal("Updated Name", updatedProduct.Name);
        }

        [Fact]
        public async Task UpdateProduct_NonExistingId_ReturnsNotFound()
        {
            var context = TestDbContextFactory.CreateInMemoryDbContext("UpdateProductNotFoundDb");
            var controller = GetController(context);

            var updateDto = new UpdateProductDto
            {
                Name = "Fake",
                Description = "Fake",
                Price = 10,
                CategoryId = 1
            };

            var result = await controller.UpdateProduct(999, updateDto);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task DeleteProduct_ExistingId_ReturnsNoContent()
        {
            var context = TestDbContextFactory.CreateInMemoryDbContext("DeleteProductDb");
            var product = new Product { Name = "Delete Me", Description = "Desc", Price = 10 };
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var controller = GetController(context);

            var result = await controller.DeleteProduct(product.Id);

            Assert.IsType<NoContentResult>(result);
            Assert.False(context.Products.Any());
        }

        [Fact]
        public async Task DeleteProduct_NonExistingId_ReturnsNotFound()
        {
            var context = TestDbContextFactory.CreateInMemoryDbContext("DeleteProductNotFoundDb");
            var controller = GetController(context);

            var result = await controller.DeleteProduct(999);

            Assert.IsType<NotFoundResult>(result);
        }
    }
}
