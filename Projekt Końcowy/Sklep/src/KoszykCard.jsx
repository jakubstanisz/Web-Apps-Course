function KoszykCard({ product, zmianaKoszyka }) {
  function zwieksz() {
    zmianaKoszyka(product.id, Number(product.quantity) + 1);
  }

  function zmniejszLubUsun() {
    zmianaKoszyka(product.id, Number(product.quantity) - 1);
  }

  function usunCalkowicie() {
    zmianaKoszyka(product.id, 0);
  }

  const znak = product.quantity > 1 ? "-" : "🗑️";

  return (
    <div className="cart-item">
      <img src={product.image} alt={product.title} />

      <div className="cart-details">
        <h4>{product.title}</h4>
        <p className="price">
          Cena: {(product.price * product.quantity).toFixed(2)} $
        </p>
      </div>

      <div
        className="cart-actions"
        style={{ display: "flex", alignItems: "center" }}
      >
        <button onClick={zmniejszLubUsun} className="btn-remove">
          {znak}
        </button>

        <span
          style={{ fontWeight: "bold", fontSize: "1.2rem", margin: "0 10px" }}
        >
          {product.quantity}
        </span>

        <button onClick={zwieksz}>+</button>

        <button
          onClick={usunCalkowicie}
          style={{
            marginLeft: "15px",
            backgroundColor: "black",
            color: "white",
            padding: "5px 10px",
            fontSize: "1rem",
          }}
          title="Usuń z koszyka"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default KoszykCard;
