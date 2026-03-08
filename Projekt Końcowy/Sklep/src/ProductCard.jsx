import { useState } from "react";

function ProductCard({
                         product,
                         dodaj,
                         aktualnyUser,
                         bazaOpinii,
                         dodajDoBazy,
                         usunZBazy,
                     }) {
    const [widoczny, setWidoczny] = useState(false);
    const [ilosc, setIlosc] = useState(1);
    const [form, setForm] = useState({ text: "", email: "", stars: 5 });

    const opinieTegoProduktu = (bazaOpinii || []).filter(
        (op) => op.productId === product.id
    );

    function dodajOpinie() {
        if (!aktualnyUser) {
            alert("Musisz być zalogowany, żeby dodać opinię!");
            return;
        }
        if (!form.text) return;

        const nowaOpinia = {
            productId: product.id,
            email: form.email,
            text: form.text,
            stars: Number(form.stars),
        };

        dodajDoBazy(nowaOpinia);
        setForm({ text: "", email: "", stars: 5 });
    }

    return (
        <div className="card">
            <img src={product.image} alt={product.title} />

            <h4>{product.title}</h4>
            <p className="price">{product.price} $</p>
            <p className="category">{product.category}</p>

            <div className="card-actions">
                <button
                    onClick={() => setWidoczny(!widoczny)}
                    style={{ width: "100%", marginBottom: "10px", background: "#6c5ce7" }}
                >
                    {widoczny ? "Ukryj Opinie" : "Pokaż Opinie i Szczegóły"}
                </button>

                {widoczny && (
                    <div style={{ marginBottom: "15px", textAlign: "left", fontSize: "0.9rem" }}>
                        <p style={{ marginBottom: "10px", fontStyle: "italic" }}>
                            {product.description}
                        </p>

                        <div style={{ backgroundColor: "#f5f6fa", padding: "15px", borderRadius: "10px" }}>
                            <h5 style={{ marginBottom: "10px" }}>
                                Opinie ({opinieTegoProduktu.length}):
                            </h5>

                            <ul style={{ listStyle: "none", padding: 0, marginBottom: "15px" }}>
                                {opinieTegoProduktu.map((op) => {
                                    const czyToAdmin = aktualnyUser === "prowadzacy";
                                    const czyToMoje = aktualnyUser === op.user;
                                    const mogeUsunac = czyToAdmin || czyToMoje;

                                    return (
                                        <li key={op.id} style={{ borderBottom: "1px solid #ddd", padding: "8px 0", position: "relative" }}>
                                            <strong>{op.user}</strong> <span style={{ color: "gold" }}>{"★".repeat(op.stars)}</span>
                                            <br />
                                            <span style={{ fontSize: "10px", color: "#888" }}>{op.email}</span>
                                            <p>{op.text}</p>

                                            {/* Przycisk USUWANIA */}
                                            {mogeUsunac && (
                                                <button
                                                    onClick={() => usunZBazy(op.id)}
                                                    style={{
                                                        position: "absolute",
                                                        right: 0,
                                                        top: "10px",
                                                        backgroundColor: "red",
                                                        padding: "2px 6px",
                                                        fontSize: "10px",
                                                        width: "auto"
                                                    }}
                                                >
                                                    USUŃ
                                                </button>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>

                            {aktualnyUser ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <input
                                        type="email"
                                        placeholder="Twój e-mail"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        style={{ padding: "5px" }}
                                    />
                                    <textarea
                                        placeholder="Treść opinii..."
                                        value={form.text}
                                        onChange={(e) => setForm({ ...form, text: e.target.value })}
                                        style={{ padding: "5px" }}
                                    />
                                    <select
                                        value={form.stars}
                                        onChange={(e) => setForm({ ...form, stars: e.target.value })}
                                        style={{ padding: "5px" }}
                                    >
                                        <option value="5">★★★★★ (5)</option>
                                        <option value="4">★★★★ (4)</option>
                                        <option value="3">★★★ (3)</option>
                                        <option value="2">★★ (2)</option>
                                        <option value="1">★ (1)</option>
                                    </select>

                                    <button onClick={dodajOpinie} style={{ background: "#00b894" }}>
                                        Wyślij opinię
                                    </button>
                                </div>
                            ) : (
                                <p style={{ color: "red", fontSize: "11px" }}>Zaloguj się, aby dodać opinię.</p>
                            )}
                        </div>
                    </div>
                )}

                <div style={{ display: "flex", alignItems: "center", marginTop: "auto" }}>
                    <input
                        value={ilosc}
                        type="number"
                        min="1"
                        onChange={(e) => setIlosc(e.target.value)}
                        style={{ width: "60px", marginRight: "10px" }}
                    />
                    <button onClick={() => dodaj(product, ilosc)} style={{ flexGrow: 1 }}>
                        + Do koszyka
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;