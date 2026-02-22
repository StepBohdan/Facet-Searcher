import ActiveFilters from "../facets/ActiveFilters";

interface ResultsHeaderProps {
  total: number;
  query: string;
  brands: string[];
  categories: string[];
  loading: boolean;
  onRemoveBrand: (b: string) => void;
  onRemoveCategory: (c: string) => void;
}

export default function ResultsHeader({
  total,
  query,
  brands,
  categories,
  loading,
  onRemoveBrand,
  onRemoveCategory,
}: ResultsHeaderProps) {
  return (
    <div className="resultsTop">
      <div className="resultsTop__meta">
        {loading ? "Loading..." : `${total} results`}
        <ActiveFilters
          query={query}
          brands={brands}
          categories={categories}
          onRemoveBrand={onRemoveBrand}
          onRemoveCategory={onRemoveCategory}
        />
      </div>
    </div>
  );
}