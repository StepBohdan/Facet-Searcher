interface ActiveFiltersProps {
    query: string;
    brands: string[];
    categories: string[];
    onRemoveBrand: (b: string) => void;
    onRemoveCategory: (c: string) => void;
}

export default function ActiveFilters({
    query,
    brands,
    categories,
    onRemoveBrand,
    onRemoveCategory,
  }: ActiveFiltersProps) {
    return (
      <>
        {query ? <span className="pill">query: {query}</span> : null}
        {brands.map((b) => (
          <button key={b} className="pill pill--x" onClick={() => onRemoveBrand(b)}>
            {b} X
          </button>
        ))}
        {categories.map((c) => (
          <button key={c} className="pill pill--x" onClick={() => onRemoveCategory(c)}>
            {c} X
          </button>
        ))}
      </>
    );
  }