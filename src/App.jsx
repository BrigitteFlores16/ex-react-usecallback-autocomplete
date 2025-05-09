import { useState, useEffect, useRef, useCallback } from "react";

function SearchSuggestions() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const timeoutRef = useRef(null);

  const handleImageError = useCallback((e) => {
    console.log("Errore caricamento immagine");
    e.target.style.display = "none";
  }, []);

  const fetchSuggestions = useCallback(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    fetch(`http://localhost:5000/products`)
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch((error) => {
        console.error("Errore nel recupero dei suggerimenti:", error);
        alert("Errore nel recupero dei suggerimenti. Riprova più tardi!");
      });
  }, [query]);

  const fetchProductDetails = useCallback((id) => {
    fetch(`http://localhost:5000/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Dati prodotto ricevuti:", data);
        setSelectedProduct(data);
      })
      .catch((error) => {
        console.error("Errore nel recupero dei dettagli del prodotto:", error);
        alert(
          "Errore nel recupero dei dettagli del prodotto. Riprova più tardi!"
        );
      });
  }, []);

  const handleSelectProduct = useCallback(
    (id) => {
      setQuery("");
      setSuggestions([]);
      fetchProductDetails(id);
    },
    [fetchProductDetails]
  );

  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [fetchSuggestions]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Cerca un prodotto"
        value={query}
        onChange={handleInputChange}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item) => (
            <li key={item.id} onClick={() => handleSelectProduct(item.id)}>
              {item.name}
            </li>
          ))}
        </ul>
      )}
      {selectedProduct && (
        <div className="product-details">
          {selectedProduct.image && (
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name || "Product image"}
              onError={handleImageError}
            />
          )}
          <h2>{selectedProduct.name || "Nome non disponibile"}</h2>
          <p>{selectedProduct.description || "Descrizione non disponibile"}</p>
          <strong>Prezzo: €{selectedProduct.price || "N/D"}</strong>
        </div>
      )}
    </div>
  );
}

export default SearchSuggestions;
