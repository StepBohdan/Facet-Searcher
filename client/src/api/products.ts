export type FacetItem = { value: string; count: number };

export type Product = {
  id: string;
  name: string;
  brand: string;
  image: string | null;
  created_at?: string;
};

export type ProductsResponse = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  facets: {
    brands: FacetItem[];
    categories: FacetItem[];
  };
};

export type ProductsQuery = {
  query: string;
  brands: string[];
  categories: string[];
  page: number;
  limit: number;
};

export async function fetchProducts(query: ProductsQuery, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (query.query){ 
        params.set("q", query.query);
    }
    
  if (query.brands.length){
        params.set("brands", query.brands.join(","));
    } 

  if (query.categories.length){
        params.set("categories", query.categories.join(","));
    } 
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));

  const result = await fetch(`/api/products?${params.toString()}`, { signal });
  if (!result.ok) {
    const text = await result.text().catch(() => "");
    throw new Error(`HTTP ${result.status} ${text}`);
  }
  return (await result.json()) as ProductsResponse;
}