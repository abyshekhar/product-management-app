import React, { useState, useEffect, type FormEvent } from "react";
import type { CreateProductDto, UpdateProductDto } from "../api/productsApi";
import type { CategoryDto } from "../api/categoriesApi";

interface ProductFormProps<T> {
  initialData?: T;
  onSubmit: (data: T) => void;
  categories: CategoryDto[];
}

function ProductForm<T extends CreateProductDto | UpdateProductDto>({
  initialData,
  onSubmit,
  categories,
}: ProductFormProps<T>) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.price || 0);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || 0);

  // Sync state whenever initialData changes (important for Edit)
  useEffect(() => {
    setName(initialData?.name || "");
    setDescription(initialData?.description || "");
    setPrice(initialData?.price || 0);
    setCategoryId(initialData?.categoryId || 0);
  }, [initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const payload =
      initialData && "id" in initialData
        ? ({
            id: initialData.id,
            name,
            description,
            price,
            categoryId,
          } as UpdateProductDto)
        : ({
            name,
            description,
            price,
            categoryId,
          } as CreateProductDto);

    onSubmit(payload as T);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Price"
      />
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))}
      >
        <option value={0}>Select Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button type="submit">{initialData ? "Update" : "Create"}</button>
    </form>
  );
}

export default ProductForm;
