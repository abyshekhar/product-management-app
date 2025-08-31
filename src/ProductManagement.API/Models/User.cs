namespace ProductManagement.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; } // In production, hash passwords before storing them!
        public required string Role { get; set; } // Admin or User
        
        // Add this for favorites
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    }
}
