import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, ProductsResponse, ProductsQuery } from "../api/products";


const parseCsv = (s: string | null) =>
  (s ?? "").split(",").map((x) => x.trim()).filter(Boolean);

const toCsv = (arr: string[]) => arr.join(",");



export function useProductsQuery() {
  const [searchParams, setSearchParams] = useSearchParams();

  const state: ProductsQuery = useMemo(() => {
    const query = searchParams.get("q") ?? "";
    const brands = parseCsv(searchParams.get("brands"));
    const categories = parseCsv(searchParams.get("categories"));
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    return { query, brands, categories, page, limit };
  }, [searchParams]);

  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetchProducts(state, controller.signal)
      .then(setData)
      .catch((e: any) => {
        if (e?.name !== "AbortError") setError(e?.message ?? "Request failed");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [state.query, state.brands.join("|"), state.categories.join("|"), state.page, state.limit]);

  function setUrl(next: Partial<ProductsQuery>) {
    const merged = { ...state, ...next };
    const nextSearchParam = new URLSearchParams();

    if (merged.query){
        nextSearchParam.set("q", merged.query);
    } 
    if (merged.brands.length){
        nextSearchParam.set("brands", toCsv(merged.brands));
    } 
    if (merged.categories.length){
        nextSearchParam.set("categories", toCsv(merged.categories));
    }

    nextSearchParam.set("page", String(merged.page));
    nextSearchParam.set("limit", String(merged.limit));

    setSearchParams(nextSearchParam, { replace: true });
  }

  function clearAll() {
    const nextSearchParam = new URLSearchParams();
    nextSearchParam.set("page", "1");
    nextSearchParam.set("limit", String(state.limit));
    setSearchParams(nextSearchParam, { replace: true });
  }

  return { state, setUrl, clearAll, data, loading, error };
}