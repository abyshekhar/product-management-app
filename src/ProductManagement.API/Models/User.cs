namespace ProductManagement.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; } // In production, hash passwords before storing them!
        public string Role { get; set; } // Admin or User
    }
}
