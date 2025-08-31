namespace ProductManagement.API.Models
{
    public class CreateProductDto
    {
        public string Name { get; set; }
        public string Description { get; set; }  // included
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
    }

}