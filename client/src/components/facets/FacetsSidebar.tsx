import FacetGroup from "./FacetGroup";

interface FacetsSidebarProps {
  brands: { value: string; count: number }[];
  categories: { value: string; count: number }[];
  selectedBrands: string[];
  selectedCategories: string[];
  onToggleBrand: (v: string) => void;
  onToggleCategory: (v: string) => void;
}

export default function FacetsSidebar({
  brands,
  categories,
  selectedBrands,
  selectedCategories,
  onToggleBrand,
  onToggleCategory,
}: FacetsSidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__title">Filters</div>
      <FacetGroup title="Brand" items={brands} selected={selectedBrands} onToggle={onToggleBrand} />
      <FacetGroup
        title="Category"
        items={categories}
        selected={selectedCategories}
        onToggle={onToggleCategory}
      />
    </aside>
  );
}