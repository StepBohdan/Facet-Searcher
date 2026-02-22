interface PaginationProps {
    page: number;
    totalPages: number;
    loading: boolean;
    onPrev: () => void;
    onNext: () => void;
    onPage: (page: number) => void;
  };
  
  function getPageItems(page: number, totalPages: number) {
    const items: (number | "...")[] = [];
    
    const showAllIfSmall = totalPages <= 7;
  
    if (showAllIfSmall) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
      return items;
    }
    items.push(1);
  
    if (page > 3) items.push("...");
  
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
  
    for (let i = start; i <= end; i++) items.push(i);
  
    if (page < totalPages - 2) items.push("...");
  
    items.push(totalPages);
  
    return items;
  }
  
  export default function Pagination({
    page,
    totalPages,
    loading,
    onPrev,
    onNext,
    onPage,
  }: PaginationProps) {
    const items = getPageItems(page, totalPages);
  
    return (
      <div className="pager">
        <button className="pager__nav" disabled={page <= 1 || loading} onClick={onPrev}>
          <span className="pager__arrow">‹</span> Previous
        </button>
  
        <div className="pager__nums" aria-label="Pagination">
          {items.map((item, idx) =>
            item === "..." ? (
              <span key={`dots-${idx}`} className="pager__dots">
                …
              </span>
            ) : (
              <button
                key={item}
                className={`pager__num ${item === page ? "is-active" : ""}`}
                disabled={loading}
                onClick={() => onPage(item)}
              >
                {item}
              </button>
            )
          )}
        </div>
  
        <button className="pager__nav" disabled={page >= totalPages || loading} onClick={onNext}>
          Next <span className="pager__arrow">›</span>
        </button>
      </div>
    );
  }