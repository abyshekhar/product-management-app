using Microsoft.EntityFrameworkCore;
using ProductManagement.API.Data;

namespace ProductManagement.API.Tests.Common
{
    public static class TestDbContextFactory
    {
        public static AppDbContext CreateInMemoryDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;

            return new AppDbContext(options);
        }
    }
}
