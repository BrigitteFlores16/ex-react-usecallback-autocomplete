import { useState, useEffect, useRef } from "react";

function SearchSuggestions() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  const fetchSuggestions = async () => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/products`);
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Errore nel recupero dei suggerimenti:", error);
      alert("Errore nel recupero dei suggerimenti. Riprova più tardi!");
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Cerca un prodotto"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchSuggestions;
