import api from "./api"; // your configured axios instance

export interface FavoriteDto {
  id: number;
  productId: number;
  productName: string;
  productDescription: string;
  price: number;
  categoryName: string;
}

// Get all favorites of the logged-in user
export const getFavorites = async (): Promise<FavoriteDto[]> => {
  const response = await api.get<FavoriteDto[]>("/favorites");
  return response.data;
};

// Add a product to favorites
export const addFavorite = async (productId: number) => {
  await api.post(`/favorites/${productId}`);
};

// Remove a product from favorites
export const removeFavorite = async (productId: number) => {
  await api.delete(`/favorites/${productId}`);
};
