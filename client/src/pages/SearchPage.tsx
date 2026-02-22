import Header from "../components/Header";
import FacetsSidebar from "../components/facets/FacetsSidebar";
import ResultsHeader from "../components/results/ResultsHeader";
import ProductGrid from "../components/results/ProductGrid";
import Pagination from "../components/results/Pagination";
import { useProductsQuery } from "../hooks/useProductsQuery";

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

export default function SearchPage() {
  const { state, setUrl, clearAll, data, loading, error } = useProductsQuery();

  const total = data?.total ?? 0;
  const items = data?.items ?? [];
  const facetsBrands = data?.facets?.brands ?? [];
  const facetsCategories = data?.facets?.categories ?? [];

  const totalPages = Math.max(1, Math.ceil(total / state.limit));

  return (
    <div className="app">
      <Header
        query={state.query}
        onSubmitSearch={(query) => setUrl({ query, page: 1 })}
        onClear={clearAll}
      />

      <div className="content">
        <FacetsSidebar
          brands={facetsBrands}
          categories={facetsCategories}
          selectedBrands={state.brands}
          selectedCategories={state.categories}
          onToggleBrand={(v) => setUrl({ brands: toggle(state.brands, v), page: 1 })}
          onToggleCategory={(v) => setUrl({ categories: toggle(state.categories, v), page: 1 })}
        />

        <main className="main">
          <ResultsHeader
            total={total}
            query={state.query}
            brands={state.brands}
            categories={state.categories}
            loading={loading}
            onRemoveBrand={(b) => setUrl({ brands: state.brands.filter((x) => x !== b), page: 1 })}
            onRemoveCategory={(c) =>
              setUrl({ categories: state.categories.filter((x) => x !== c), page: 1 })
            }
          />

          {error ? <div className="error">{error}</div> : null}

          {items.length === 0 && !loading ? <div className="empty">No products found.</div> : <ProductGrid items={items} />}

          <div className="resultsBottom">
            <Pagination
              page={state.page}
              totalPages={totalPages}
              loading={loading}
              onPrev={() => setUrl({ page: state.page - 1 })}
              onNext={() => setUrl({ page: state.page + 1 })}
              onPage={(p) => setUrl({ page: p })}
            />
          </div>
        </main>
      </div>
    </div>
  );
}