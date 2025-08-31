// categoriesApi.ts
import api from "./api";

export interface CategoryDto {
  id: number;
  name: string;
}

export const getCategories = async (): Promise<CategoryDto[]> => {
  const response = await api.get<CategoryDto[]>("/categories");
  return response.data;
};
