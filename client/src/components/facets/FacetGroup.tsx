interface FacetGroupProps {
    title: string;
    items: { value: string; count: number }[];
    selected: string[];
    onToggle: (value: string) => void;
}

export default function FacetGroup({
    title,
    items,
    selected,
    onToggle,
  }: FacetGroupProps) {
    return (
      <div className="facet">
        <div className="facet__title">{title}</div>
        <div className="facet__list">
          {items.map((it) => {
            const checked = selected.includes(it.value);
            return (
              <label key={it.value} className="facet__item">
                <input type="checkbox" checked={checked} onChange={() => onToggle(it.value)} />
                <span className="facet__label">{it.value}</span>
                <span className="facet__count">{it.count}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }