import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ filtruj, kto, wyloguj }) {
  const [text, setText] = useState("");

  function handleTextChange(event) {
    setText(event.target.value);
    filtruj(event.target.value);
  }

  return (
    <div className="navbar">
      <h1>Witaj na naszym super sklepie</h1>

      <input
        type="text"
        placeholder="Wyszukaj..."
        onChange={handleTextChange}
      />

      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/">
          <button>Strona Główna</button>
        </Link>

        <Link to="/koszyk">
          <button>Koszyk</button>
        </Link>

        {kto ? (
          <>
            <Link to="/profil">
              <button style={{ backgroundColor: "#fab1a0", color: "#2d3436" }}>
                Profil ({kto})
              </button>
            </Link>
            <button onClick={wyloguj} style={{ backgroundColor: "#d63031" }}>
              Wyloguj
            </button>
          </>
        ) : (
          <Link to="/logowanie">
            <button>Zaloguj się</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
