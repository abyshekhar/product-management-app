import api from "./api"; // Axios instance

export interface CategoryDto {
  id: number;
  name: string;
}

export const getCategories = async (): Promise<CategoryDto[]> => {
  const res = await api.get<CategoryDto[]>("/categories");
  return res.data;
};

export const createCategory = async (category: { name: string }) => {
  const res = await api.post("/categories", category);
  return res.data;
};

export const updateCategory = async (category: CategoryDto) => {
  const res = await api.put(`/categories/${category.id}`, category);
  return res.data;
};

export const deleteCategory = async (id: number) => {
  await api.delete(`/categories/${id}`);
};
