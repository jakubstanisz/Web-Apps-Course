import { useState } from "react";
import ProductCard from "./ProductCard";
import KoszykCard from "./KoszykCard";
import { Link, useNavigate } from "react-router-dom";

function Koszyk({ zawartosc, zmiana }) {
  let navigate = useNavigate();

  function naglowna() {
    navigate("/");
  }

  function kupione() {}

  return (
    <div className="cart-container">
      {zawartosc.length > 0 ? (
        <>
          {zawartosc.map((produkt) => (
            <KoszykCard 
                key={produkt.id} 
                product={produkt} 
                zmianaKoszyka={zmiana} 
            />
          ))}

          <div className="cart-footer">
            <button onClick={naglowna} className="btn-secondary">
              ← Kup coś jeszcze
            </button>
            
            <Link to="/podsumowanie">
              <button onClick={kupione} className="btn-primary">
                PODSUMOWANIE →
              </button>
            </Link>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
           <h2>Twój koszyk jest pusty :(</h2>
           <button onClick={naglowna} style={{ marginTop: "20px" }}>Wróć do sklepu</button>
        </div>
      )}
    </div>
  );
}

export default Koszyk;