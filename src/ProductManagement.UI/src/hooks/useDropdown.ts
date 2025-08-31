// useDropdown.ts
import { useState, useEffect } from "react";

interface UseDropdownProps<T> {
  fetchFunction: () => Promise<T[]>;
}

export function useDropdown<T>({ fetchFunction }: UseDropdownProps<T>) {
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchFunction();
        setOptions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchFunction]);

  return { options, loading };
}
