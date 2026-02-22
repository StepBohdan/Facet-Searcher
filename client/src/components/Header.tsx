import { useEffect, useState } from "react";

interface HeaderProps {
  query: string;
  onSubmitSearch: (query: string) => void;
  onClear: () => void;
}

export default function Header({
  query,
  onSubmitSearch,
  onClear,
}: HeaderProps) {
  const [inputQ, setInputQ] = useState(query);

  useEffect(() => setInputQ(query), [query]);

  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__logo">
          <span className="nav__logoMark">Facet Searcher</span>
        </div>

        <form
          className="nav__search"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitSearch(inputQ.trim());
          }}
        >
          <input
            className="nav__searchInput"
            value={inputQ}
            onChange={(e) => setInputQ((e.target as HTMLInputElement).value)}
            placeholder="Search products..."
          />
          <button className="nav__searchBtn" type="submit">
            Search
          </button>
        </form>

        <div className="nav__right">
          <button className="nav__smallBtn" type="button" onClick={onClear}>
            Clear
          </button>
        </div>
      </div>
    </header>
  );
}