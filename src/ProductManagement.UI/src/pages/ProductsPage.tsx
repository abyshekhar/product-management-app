import React, { useEffect, useState } from "react";
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

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<UpdateProductDto | null>(
    null
  );
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h1>Products</h1>

      <h2>{editingProduct ? "Edit Product" : "Create Product"}</h2>
      <ProductForm<UpdateProductDto>
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
