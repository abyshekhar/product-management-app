import React, { useEffect, useState } from "react";
import {
  getFavorites,
  removeFavorite,
  type FavoriteDto,
} from "../api/favoritesApi";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<FavoriteDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: number) => {
    if (window.confirm("Remove from favorites?")) {
      await removeFavorite(productId);
      fetchFavorites();
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) return <p>Loading favorites...</p>;

  return (
    <div>
      <h1>Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {favorites.map((f) => (
              <tr key={f.id}>
                <td>{f.productName}</td>
                <td>{f.productDescription}</td>
                <td>{f.price}</td>
                <td>{f.categoryName}</td>
                <td>
                  <button onClick={() => handleRemove(f.productId)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FavoritesPage;
