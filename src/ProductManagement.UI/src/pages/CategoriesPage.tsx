// CategoriesPage.tsx
import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryDto,
} from "../api/categoriesApi";
import CategoryForm from "../components/CategoryForm";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(
    null
  );

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Example: CategoriesPage.tsx
  const handleCreate = async (category: { name: string }) => {
    await createCategory(category);
    fetchCategories();
  };

  const handleUpdate = async (category: CategoryDto) => {
    await updateCategory(category);
    fetchCategories();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure?")) {
      await deleteCategory(id);
      fetchCategories();
    }
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <div>
      <h1>Categories</h1>

      <h2>{editingCategory ? "Edit Category" : "Create Category"}</h2>
      <CategoryForm
        initialData={editingCategory || undefined}
        onSubmit={editingCategory ? handleUpdate : handleCreate}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                <button onClick={() => setEditingCategory(c)}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesPage;
