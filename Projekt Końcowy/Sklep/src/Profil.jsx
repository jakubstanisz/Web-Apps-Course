function Profil({ kto, historia }) {
  if (!kto) {
    return <h2>Zaloguj się, aby zobaczyć profil.</h2>;
  }

  const mojeZamowienia = historia.filter(
    (zamowienie) => zamowienie.uzytkownik === kto,
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Profil użytkownika: {kto}</h1>
      <hr />

      <h2>Twoja historia zamówień</h2>

      {mojeZamowienia.length === 0 ? (
        <p>Nie masz jeszcze żadnych zamówień.</p>
      ) : (
        mojeZamowienia.map((zamowienie) => (
          <div
            key={zamowienie.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h3>Zamówienie nr: {zamowienie.id}</h3>
            <p>
              <strong>Data:</strong> {zamowienie.data}
            </p>
            <p>
              <strong>Kwota:</strong> {zamowienie.lacznaCena} $
            </p>

            <details>
              <summary>Zobacz kupione produkty</summary>
              <ul>
                {zamowienie.produkty.map((item, index) => (
                  <li key={index}>
                    {item.title} - Ilość: {item.quantity} (
                    {(item.price * item.quantity).toFixed(2)} $)
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))
      )}
    </div>
  );
}

export default Profil;
