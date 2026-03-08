import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "./api";

function Logowanie({ bazaUserow, ustawZalogowany }) {
  const [user, setUser] = useState("");
  const [haslo, setHaslo] = useState("");
  const [error, setError] = useState("");

  function handleUserChange(event) {
    setUser(event.target.value);
  }

  function handleHasloChange(event) {
    setHaslo(event.target.value);
  }

  const navigate = useNavigate();

    async function checkUser() {
        setError("");

        try {
            const response = await api.post("/login", {
                name: user,
                haslo: haslo,
            });

            const { accessToken, refreshToken, role } = response.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("zalogowanyUser", user);

            ustawZalogowany(user);

            navigate("/");

        } catch (err) {
            console.error("Błąd logowania:", err);
            if (err.response && err.response.status === 401) {
                setError("Nieprawidłowy login lub hasło!");
            } else if (!err.response) {
                setError("Błąd połączenia z serwerem (sprawdź czy node działa)");
            } else {
                setError("Wystąpił błąd logowania.");
            }
        }
    }

  return (
    <>
      <div className="form-container">
        <label> Nazwa uzytkowanika: </label>
        <input type="text" value={user} onChange={handleUserChange} />

        <br />

        <label> Haslo </label>
        <input type="password" value={haslo} onChange={handleHasloChange} placeholder="Wpisz hasło..."/>

        <br />

        <button onClick={checkUser}> Zaloguj sie wariacie </button>

        <p> NIE MA KONTA WARIACIE?</p>

        <Link to="/rejestracja">
          <button>Zarejestruj sie Kocie 🐈!</button>
        </Link>
      </div>
    </>
  );
}

export default Logowanie;
