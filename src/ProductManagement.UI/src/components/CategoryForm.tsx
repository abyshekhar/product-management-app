// CategoryForm.tsx
import { useEffect, useState, type FormEvent } from "react";

interface CategoryFormProps<T> {
  initialData?: T;
  onSubmit: (data: T) => void;
}

function CategoryForm<T extends { id?: number; name: string }>({
  initialData,
  onSubmit,
}: CategoryFormProps<T>) {
  const [name, setName] = useState(initialData?.name || "");

  // Sync state whenever initialData changes (important for Edit)
    useEffect(() => {
      setName(initialData?.name || "");
    }, [initialData]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const payload = initialData?.id
      ? ({ id: initialData.id, name } as T) // Update
      : ({ name } as T); // Create

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
        required
      />
      <button type="submit">{initialData ? "Update" : "Create"}</button>
    </form>
  );
}

export default CategoryForm;
