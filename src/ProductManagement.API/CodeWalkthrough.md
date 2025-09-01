## Program.cs

### `using System.Text;`
This imports the `System.Text` namespace, which provides classes for working with character encodings, such as `Encoding.UTF8`. This is needed to convert the JWT secret key from a string to a byte array.

### `using Microsoft.AspNetCore.Authentication.JwtBearer;`
This line imports the namespace for JWT Bearer authentication, a standard for securing APIs.

### `using Microsoft.EntityFrameworkCore;`
This imports the namespace for Entity Framework Core, a popular Object-Relational Mapper (ORM) for .NET. It's used here to configure the database context.

### `using Microsoft.IdentityModel.Tokens;`
This imports the namespace containing classes for cryptographic operations related to security tokens, like `SymmetricSecurityKey`.

### `using ProductManagement.API.Data;`
This imports a custom namespace, likely containing the `AppDbContext` class that represents the database session.

### `using FluentValidation.AspNetCore;`
This imports the namespace for FluentValidation, a popular library for creating validation rules for models.

---

### `var builder = WebApplication.CreateBuilder(args);`
This creates a `WebApplicationBuilder` instance, which is the starting point for configuring and building a .NET web application.

---

### `builder.Services.AddCors(...)`
This configures **Cross-Origin Resource Sharing (CORS)**. It defines a policy named `"AllowFrontend"` that permits requests from the specified frontend origin (`http://localhost:5173`), allows all headers and methods, and explicitly exposes the `X-Total-Count` custom header to the client.

---

### `builder.Services.AddAuthentication(...)`
This sets up **JWT Bearer authentication**.
* `.AddJwtBearer(...)` configures the validation parameters for JWTs.
* `ValidateIssuer`, `ValidateAudience`, `ValidateLifetime`, and `ValidateIssuerSigningKey` are all set to `true`, which enforces strict validation of the token's origin, intended recipient, expiration, and signature.
* `ValidIssuer` and `ValidAudience` are configured to read their values from the application's configuration file (e.g., `appsettings.json`), ensuring the token's claims match the expected values.
* `IssuerSigningKey` is created from a secret key stored in the configuration, which is used to verify the token's signature and ensure its authenticity.

---

### `builder.Services.AddAuthorization(...)`
This configures **authorization policies**. It defines two policies:
* `"AdminOnly"`: Requires the user to have the "Admin" role.
* `"UserOnly"`: Requires the user to have the "User" role. These policies can then be applied to controller actions or endpoints.

---

### `builder.Services.AddDbContext<AppDbContext>(...)`
This registers the `AppDbContext` with the dependency injection container, configuring it to use SQL Server and setting the connection string from the application's configuration.

---

### `builder.Services.AddControllers()`
This adds controller services to the application, enabling it to handle incoming HTTP requests via controllers.
* `.AddJsonOptions(...)` configures the JSON serializer, ensuring that no properties are ignored during serialization.
* `.AddFluentValidation(...)` integrates FluentValidation, automatically registering validators from the same assembly as the `Program` class.

---

### `builder.Services.AddEndpointsApiExplorer();`
This service is added to enable API exploration, which is required for tools like Swagger to generate API documentation.

### `builder.Services.AddSwaggerGen();`
This adds the Swagger generator service, which creates OpenAPI specifications for your API.

---

### `var app = builder.Build();`
This line builds the `WebApplication` instance, creating the application's request pipeline based on the services configured above.

---

### `if (app.Environment.IsDevelopment()) { ... }`
This block of code is executed only in the development environment.
* `app.UseSwagger()`: Enables the Swagger middleware to serve the generated API documentation.
* `app.UseSwaggerUI()`: Enables the Swagger UI, providing a web-based interface for exploring and testing the API.

---

### `app.UseCors("AllowFrontend");`
This enables the previously defined CORS policy, applying the `"AllowFrontend"` rules to all requests. This is a crucial step for the CORS configuration to take effect.

### `app.UseAuthentication();`
This middleware adds the authentication services to the request pipeline. It is responsible for checking for and validating tokens (like the JWT) on every incoming request.

### `app.UseAuthorization();`
This middleware adds the authorization services. It checks the user's claims and roles to determine if they have permission to access a specific resource based on the policies defined earlier.

---

### `app.UseHttpsRedirection();`
This middleware automatically redirects all HTTP requests to their HTTPS equivalent, enhancing security.

### `app.MapControllers();`
This maps controller-based endpoints to the request pipeline, allowing the application to route incoming requests to the appropriate controller actions.

### `app.Run();`
This runs the application, starting the web server and listening for incoming HTTP requests.

---

### `public partial class Program { }`
This line allows the `Program` class to be extended by other partial classes. In this context, it's often used for integration testing frameworks, enabling them to reference the application's entry point.