import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { pool } from "./db/pool";

const app = express();
app.use(cors());
app.use(express.json());


app.get("/api/products", async (req, res) => {
  try {
    const q = String(req.query.q ?? "").trim();

    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 20)));
    const offset = (page - 1) * limit;

    const brands = String(req.query.brands ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const categories = String(req.query.categories ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const baseWhereParts: string[] = [];
    const baseParams: any[] = [];

    if (q) {
      baseParams.push(`%${q}%`);
      baseWhereParts.push(`p.name ilike $${baseParams.length}`);
    }

    if (brands.length) {
      baseParams.push(brands);
      baseWhereParts.push(`b.name = any($${baseParams.length})`);
    }

    if (categories.length) {
      baseParams.push(categories);
      baseWhereParts.push(`
        exists (
          select 1
          from product_categories pc
          join categories c on c.id = pc.category_id
          where pc.product_id = p.id
            and c.name = any($${baseParams.length})
        )
      `);
    }

    const baseWhere = baseWhereParts.length ? `where ${baseWhereParts.join(" and ")}` : "";

    const itemsSql = `
      select
        p.id,
        p.name,
        p.image,
        coalesce(nullif(trim(b.name), ''), 'Unbranded') as brand,
        p.created_at
      from products p
      left join brands b on b.id = p.brand_id
      ${baseWhere}
      order by md5(p.id)
      limit ${limit} offset ${offset}
    `;

    const totalSql = `
      select count(*)::int as total
      from products p
      left join brands b on b.id = p.brand_id
      ${baseWhere}
    `;

    const brandWhereParts: string[] = [];
    const brandParams: any[] = [];

    if (q) {
      brandParams.push(`%${q}%`);
      brandWhereParts.push(`p.name ilike $${brandParams.length}`);
    }

    if (categories.length) {
      brandParams.push(categories);
      brandWhereParts.push(`
        exists (
          select 1
          from product_categories pc
          join categories c on c.id = pc.category_id
          where pc.product_id = p.id
            and c.name = any($${brandParams.length})
        )
      `);
    }

    const brandWhere = brandWhereParts.length ? `where ${brandWhereParts.join(" and ")}` : "";

    const brandsFacetSql = `
      select b.name as value, count(*)::int as count
      from products p
      join brands b on b.id = p.brand_id
      ${brandWhere}
      group by b.name
      order by count desc, value asc
      limit 50
    `;

    const categoriesWhereParts: string[] = [];
    const categoriesParams: any[] = [];

    if (q) {
      categoriesParams.push(`%${q}%`);
      categoriesWhereParts.push(`p.name ilike $${categoriesParams.length}`);
    }

    if (brands.length) {
      categoriesParams.push(brands);
      categoriesWhereParts.push(`b.name = any($${categoriesParams.length})`);
    }

    const categoriesWhere = categoriesWhereParts.length
      ? `where ${categoriesWhereParts.join(" and ")}`
      : "";

    const categoriesFacetSql = `
      select c.name as value, count(distinct p.id)::int as count
      from products p
      left join brands b on b.id = p.brand_id
      join product_categories pc on pc.product_id = p.id
      join categories c on c.id = pc.category_id
      ${categoriesWhere}
      group by c.name
      order by count desc, value asc
      limit 50
    `;

    const [items, total, brandsFacet, categoriesFacet] = await Promise.all([
      pool.query(itemsSql, baseParams),
      pool.query(totalSql, baseParams),
      pool.query(brandsFacetSql, brandParams),
      pool.query(categoriesFacetSql, categoriesParams),
    ]);

    res.json({
      items: items.rows,
      total: total.rows[0].total,
      page,
      limit,
      facets: {
        brands: brandsFacet.rows,
        categories: categoriesFacet.rows,
      },
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: e?.message ?? "server error" });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});