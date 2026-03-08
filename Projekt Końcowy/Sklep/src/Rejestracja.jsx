import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Rejestracja({ dodajUsera }) {
  const [user, setUser] = useState("");
  const [haslo, setHaslo] = useState("");
  const [haslo2, setHaslo2] = useState("");

  function handleUserChange(event) {
    setUser(event.target.value);
  }

  function handleHasloChange(event) {
    setHaslo(event.target.value);
  }

  function handleHasloChange2(event) {
    setHaslo2(event.target.value);
  }

  const navigate = useNavigate();

    async function ogarnijRejestracje() {
        if (user === "" || haslo === "") { alert("Wypełnij pola!"); return; }
        if (haslo !== haslo2) { alert("Hasła muszą być takie same!"); return; }

        try {
            await api.post("/register", {
                name: user,
                haslo: haslo
            });
            alert("Konto założone! Teraz się zaloguj.");
            navigate("/logowanie");
        } catch (err) {
            if (err.response && err.response.status === 400) {
                alert("Taki użytkownik już istnieje!");
            } else {
                alert("Błąd serwera");
            }
        }
    }

  return (
    <>
      <div className="form-container">
        <label> Nazwa uzytkowanika: </label>
        <input type="text" value={user} onChange={handleUserChange} />
        <br />
        <label> Haslo: </label>
        <input type="text" value={haslo} onChange={handleHasloChange} />
        <br />
        <label> Powtorz haslo: </label>
        <input type="text" value={haslo2} onChange={handleHasloChange2} />{" "}
        <br />
        <button onClick={ogarnijRejestracje}> Zarejestruj sie </button>
      </div>
    </>
  );
}

export default Rejestracja;
