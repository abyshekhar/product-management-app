import React, { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productsApi";
import type { ProductDto, UpdateProductDto } from "../api/productsApi";
import ProductForm from "../components/ProductForm";

interface Category {
  id: number;
  name: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<UpdateProductDto | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]); // assume we fetch this too

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data); // fix: data is already an array
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // TODO: fetch categories from API
    setCategories([
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ]);
  }, []);

  // Convert ProductDto to UpdateProductDto for editing
  const handleEdit = (product: ProductDto) => {
    const initialData: UpdateProductDto = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId:
        categories.find((c) => c.name === product.categoryName)?.id || 0, // map name to ID
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

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h1>Products</h1>

      <h2>{editingProduct ? "Edit Product" : "Create Product"}</h2>
      <ProductForm
        initialData={editingProduct || undefined}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
        categories={categories}
      />

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
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.price}</td>
              <td>{p.categoryName}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsPage;
