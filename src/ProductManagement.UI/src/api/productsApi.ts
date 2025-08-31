import api from "./api";

export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryName: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

export interface UpdateProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

export const createProduct = async (
  product: CreateProductDto
): Promise<ProductDto> => {
  const response = await api.post<ProductDto>("/products", product);
  return response.data;
};
export const getProducts = async (): Promise<ProductDto[]> => {
  const response = await api.get<ProductDto[]>("/products");
  return response.data;
};

export const updateProduct = async (
  product: UpdateProductDto
): Promise<void> => {
  await api.put(`/products/${product.id}`, product);
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};
