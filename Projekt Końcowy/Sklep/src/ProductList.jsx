import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

function ProductList({
  Filtr,
  dodajDoKoszyka,
  kto,
  wszystkieOpinie,
  dodajOpinieApp,
  usunOpinieApp,
}) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("wszystko");

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Błąd:", error));
  }, []);

  function onAdd(item, ilosc) {
    dodajDoKoszyka(item, ilosc);
  }

  return (
    <div style={{ padding: "20px" }}>
      <div className="gora">
        <h2>Lista Produktów</h2>
        <button onClick={() => setCategory("wszystko")}> Wszystko </button>
        <button onClick={() => setCategory("men's clothing")}>Mężczyźni</button>
        <button onClick={() => setCategory("women's clothing")}>Kobiety</button>
        <button onClick={() => setCategory("jewelery")}> Biżuteria </button>
        <button onClick={() => setCategory("electronics")}>Elektronika</button>
      </div>

      <div className="product-grid">
        {products.map((produkt) =>
          (category === "wszystko" || produkt.category === category) &&
          produkt.title.toLowerCase().includes(Filtr.toLowerCase()) ? (
            <ProductCard
              key={produkt.id}
              product={produkt}
              dodaj={onAdd}
              aktualnyUser={kto}
              // --- Przekazujemy dalej do karty ---
              bazaOpinii={wszystkieOpinie}
              dodajDoBazy={dodajOpinieApp}
              usunZBazy={usunOpinieApp}
            />
          ) : null,
        )}
      </div>
    </div>
  );
}

export default ProductList;