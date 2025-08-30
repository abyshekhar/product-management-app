using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Replace default authentication with FakeAuth
            services.AddAuthentication("TestAuth")
                .AddScheme<AuthenticationSchemeOptions, FakeAuthHandler>("TestAuth", options => { });
        });
    }
}
