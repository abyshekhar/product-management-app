// ProductForm.tsx
import React, { useState, type FormEvent } from "react";
import type { CreateProductDto, UpdateProductDto } from "../api/productsApi";

interface ProductFormProps<T> {
  initialData?: T;
  onSubmit: (data: T) => void;
  categories: { id: number; name: string }[];
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

const handleSubmit = (e: FormEvent) => {
  e.preventDefault();

  // Check if initialData has id (i.e., it's UpdateProductDto)
  const payload =
    initialData && "id" in initialData
      ? ({
          id: initialData.id, // safe now
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

  onSubmit(payload as any); // TypeScript now understands the types
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
