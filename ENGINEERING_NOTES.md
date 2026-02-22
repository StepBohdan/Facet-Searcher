## What I built and why

**Stack:** React + TypeScript (Vite) on the frontend, Node.js (Express) on the backend, Supabase Postgres as the database.

**One search endpoint:** `GET /api/products` returns everything the UI needs in one response:

- `items` (products for the current page)

- `total` (for pagination)

- `facets` (brand/category options with counts)

This keeps the client simple: every time the user changes the search, filters, or page, the app makes **one request** and gets a consistent snapshot of results + counts.

**URL is the source of truth:** search text, selected brands/categories, and page are stored in the URL (e.g. `?q=milk&brands=Heinz&categories=Snacks&page=2`).

This makes the page shareable, and state is restored on refresh.

**Facets behave like a real marketplace:**

- Brand counts are calculated using `search + category filters`, but **ignoring the selected brand filters**.

- Category counts are calculated using `search + brand filters`, but **ignoring the selected category filters**.

This avoids the common “facet collapse” problem where choosing a brand makes all other brands show `0`.

**Category filtering uses `EXISTS`:** categories are filtered via an `EXISTS (...)` check on the junction table instead of joining categories into the main product query. This avoids duplicates and keeps the main query predictable.

**Imperfect data handling:** some products don’t have `brand_id` and/or an image. The backend uses `LEFT JOIN` so those products still appear, and the UI shows a fallback image placeholder. “Unbranded” is shown only when a brand is actually missing.

---

## Component split and render performance

The UI is split into small components:

- `Header` (top bar + search)

- `FacetsSidebar` / `FacetGroup` (filters)

- `ResultsHeader` + active filter chips

- `ProductGrid` / `ProductCard` (results)

- `Pagination` (page numbers)

The URL + fetching logic lives in a custom hook (`useProductsQuery`).

This keeps `SearchPage` mostly “layout only”, and makes the code easier to maintain.

Why this matters for performance:

- smaller components are easier to optimize

- only parts that need new props update

- if needed, I can add `React.memo` to heavy components (like `FacetGroup` or `ProductCard`) to reduce unnecessary re-renders

---

## Tradeoffs

- **Offset pagination (page/limit)** is the simplest approach for a take-home. For very deep pages it can get slower; cursor pagination would be better at scale.

- **Partial search with `ILIKE`** is easy and works well for a demo. For large datasets, Postgres full-text search (or a dedicated search service) would be faster and more relevant.

---

## How I would scale this further

If this needed to handle much more traffic/data:

- Use **Postgres full-text search** with proper indexes (or an external search engine for ranking/features).

- Switch to **cursor-based pagination** to avoid large offsets.

- Add **caching** for common facet requests (facet counts are often repeated).

- Add/verify indexes on `products.brand_id`, `product_categories.product_id`, and `product_categories.category_id`.

---

## One non-trivial decision / edge case

**Facet counts should ignore their own filter.**

If you compute brand counts after applying the currently selected brands, all other brands become `0` and the UI feels broken. To avoid that, brand counts are computed with `search + categories` only, and category counts are computed with `search + brands` only. This requires separate facet queries, but produces the expected marketplace behavior.