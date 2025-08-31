namespace ProductManagement.API.Models
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }  // included
        public decimal Price { get; set; }
        public string CategoryName { get; set; }
        public int Categories { get; set; }
        public int CategoryId { get; set; }
    }

}
