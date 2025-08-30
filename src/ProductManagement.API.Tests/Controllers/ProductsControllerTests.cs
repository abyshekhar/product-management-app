using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductManagement.API.Controllers;
using ProductManagement.API.Data;
using ProductManagement.API.Models;
using ProductManagement.API.Tests.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace ProductManagement.API.Tests.Controllers
{
    public class ProductsControllerTests
    {
        private ProductsController GetController(AppDbContext context)
        {
            return new ProductsController(context);
        }

        [Fact]
        public async Task GetProducts_WhenCalled_ReturnsAllProducts()
        {
            // Arrange
            var context = TestDbContextFactory.CreateInMemoryDbContext("GetProductsDb");
            context.Products.AddRange(new List<Product>
            {
                new Product { Name = "Product 1", Description = "Desc 1", Price = 10 },
                new Product { Name = "Product 2", Description = "Desc 2", Price = 20 }
            });
            await context.SaveChangesAsync();

            var controller = GetController(context);

            // Act
            var result = await controller.GetProducts();

            // Assert
            var products = Assert.IsType<ActionResult<IEnumerable<Product>>>(result);
            Assert.Equal(2, products.Value.Count());
        }

        [Fact]
        public async Task GetProduct_ExistingId_ReturnsProduct()
        {
            // Arrange
            var context = TestDbContextFactory.CreateInMemoryDbContext("GetProductDb");
            var product = new Product { Name = "Single Product", Description = "Desc", Price = 50 };
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var controller = GetController(context);

            // Act
            var result = await controller.GetProduct(product.Id);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Product>>(result);
            var returnedProduct = Assert.IsType<Product>(actionResult.Value);
            Assert.Equal("Single Product", returnedProduct.Name);
        }

        [Fact]
        public async Task GetProduct_NonExistingId_ReturnsNotFound()
        {
            var context = TestDbContextFactory.CreateInMemoryDbContext("GetProductNotFoundDb");
            var controller = GetController(context);

            var result = await controller.GetProduct(999);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task UpdateProduct_ValidData_ReturnsNoContent()
        {
            var context = TestDbContextFactory.CreateInMemoryDbContext("UpdateProductDb");
            var product = new Product { Name = "Old Name", Description = "Old Desc", Price = 100 };
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var controller = GetController(context);

            product.Name = "Updated Name";

            var result = await controller.UpdateProduct(product.Id, product);

            Assert.IsType<NoContentResult>(result);

            var updatedProduct = await context.Products.FindAsync(product.Id);
            Assert.Equal("Updated Name", updatedProduct.Name);
        }

        [Fact]
        public async Task UpdateProduct_NonExistingId_ReturnsNotFound()
        {
            var context = TestDbContextFactory.CreateInMemoryDbContext("UpdateProductNotFoundDb");
            var controller = GetController(context);

            var product = new Product { Id = 999, Name = "Fake", Description = "Fake", Price = 10 };

            var result = await controller.UpdateProduct(999, product);

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
