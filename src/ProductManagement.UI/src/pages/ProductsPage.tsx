import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productsApi";
import type { ProductDto, UpdateProductDto } from "../api/productsApi";
import type { CategoryDto } from "../api/categoriesApi";
import ProductForm from "../components/ProductForm";
import { getCategories } from "../api/categoriesApi";
import { getFavorites, addFavorite, removeFavorite } from "../api/favoritesApi";

const ProductsPage = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<UpdateProductDto | null>(
    null
  );
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        page,
        pageSize,
        search: searchTerm || "",
      });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch favorites for logged-in user
  const fetchFavorites = async () => {
    try {
      const favs = await getFavorites();
      setFavoriteIds(favs.map((f) => f.productId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchFavorites();
  }, []);

  // Convert ProductDto to UpdateProductDto
  const handleEdit = (product: ProductDto) => {
    const initialData: UpdateProductDto = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId:
        categories.find((c) => c.name === product.categoryName)?.id || 0,
    };
    setEditingProduct(initialData);
  };

  const handleCreate = async (product: UpdateProductDto) => {
    await createProduct(product);
    fetchProducts();
  };

  const handleUpdate = async (product: UpdateProductDto) => {
    await updateProduct(product);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure?")) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  const handleToggleFavorite = async (productId: number) => {
    try {
      if (favoriteIds.includes(productId)) {
        await removeFavorite(productId);
      } else {
        await addFavorite(productId);
      }
      await fetchFavorites();
    } catch (err) {
      console.error(err);
      alert("Failed to update favorite.");
    }
  };

  // Compute filtered products safely
  const filteredProducts = (products || []).filter((p) => {
    const matchesName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || p.categoryId === selectedCategory;
    return matchesName && matchesCategory;
  });

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h1>Products</h1>

      {/* Search and Filter Controls */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value === "" ? "" : parseInt(e.target.value)
            )
          }
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Create / Edit Form */}
      <h2>{editingProduct ? "Edit Product" : "Create Product"}</h2>
      <ProductForm<UpdateProductDto>
        initialData={editingProduct || undefined}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
        categories={categories}
      />

      {/* Products Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>{p.price}</td>
                <td>{p.categoryName}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                  <button onClick={() => handleToggleFavorite(p.id)}>
                    {favoriteIds.includes(p.id) ? "❤️" : "🤍"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No products found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsPage;
