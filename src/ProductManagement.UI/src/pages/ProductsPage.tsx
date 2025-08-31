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
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts({
        page,
        pageSize,
        search: searchTerm || "",
        categoryId: selectedCategory || undefined, // ✅ Add this
      });

      // Assuming getProducts returns an AxiosResponse
      setProducts(response.data);
      const totalCount = response.total
      setTotal(totalCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

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
  }, [page, searchTerm, selectedCategory]); // Added dependencies for pagination and filters

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

  const totalPages = Math.ceil(total / pageSize);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="center w-full">
      <h1>
        Products
      </h1>

      {/* Search and Filter Controls */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          style={{ marginRight: "10px" }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(
              e.target.value === "" ? "" : parseInt(e.target.value)
            );
            setPage(1);
          }}
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
      <h2 className="text-2xl">{editingProduct ? "Edit Product" : "Create Product"}</h2>
      <ProductForm<UpdateProductDto>
        initialData={editingProduct || undefined}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
        categories={categories}
      />

      {/* Products Table */}
      <table className="w-full">
        <thead className="p-2">
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
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>{p.price}</td>
                <td>{p.categoryName}</td>
                <td>
                  <button className="p-2" onClick={() => handleEdit(p)}>
                    Edit
                  </button>
                  <button className="p-2" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                  <button
                    className="p-2"
                     onClick={() => handleToggleFavorite(p.id)}
                  >
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
