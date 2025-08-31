// src/pages/UserDashboard.tsx
import React, { useEffect, useState } from "react";
import { getProducts } from "../api/productsApi";
import { getCategories } from "../api/categoriesApi";

interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  categoryId: number; // ensure this exists from API
}

interface CategoryDto {
  id: number;
  name: string;
}

const UserDashboard = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodData, catData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(prodData);
        setCategories(catData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 0 || p.categoryId === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.description.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>User Dashboard</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginRight: "1rem" }}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
        >
          <option value={0}>All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan={4}>No products found.</td>
            </tr>
          ) : (
            filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>{p.price}</td>
                <td>{p.categoryName}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;
