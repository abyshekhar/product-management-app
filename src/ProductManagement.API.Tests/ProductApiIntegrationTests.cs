using System.Net.Http.Json;
using Xunit;

public class ProductApiIntegrationTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ProductApiIntegrationTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateProduct_ReturnsCreatedProduct()
    {

        var product = new { Name = "Integration Test Product",Description="Integration Test Product", Price = 99,CategoryId =1 };

        var response = await _client.PostAsJsonAsync("/api/products", product);

        Assert.Equal(System.Net.HttpStatusCode.Created, response.StatusCode);
    }
}
