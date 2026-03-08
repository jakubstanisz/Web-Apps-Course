function Podsumowanie({ obliczCene, zlozZamowienie }) {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Podsumowanie zamówienia</h2>
      <h3>Do zapłaty: {obliczCene()} $</h3>

      <button
        onClick={zlozZamowienie}
        style={{
          backgroundColor: "green",
          color: "white",
          padding: "10px 20px",
        }}
      >
        POTWIERDZAM ZAKUP
      </button>
    </div>
  );
}

export default Podsumowanie;
