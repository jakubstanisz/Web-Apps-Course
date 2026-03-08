import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import ProductList from "./ProductList";
import Koszyk from "./Koszyk";
import { Route, Routes, useNavigate } from "react-router-dom";
import Logowanie from "./Logowanie";
import Rejestracja from "./Rejestracja";
import Podsumowanie from "./Podsumowanie";
import Profil from "./Profil";
import WymaganeLogowanie from "./WymaganeLogowanie";
import api from "./api";

function App() {
    const [filtr, setFiltr] = useState("");
    const navigate = useNavigate();

    const [zalogowany, setZalogowany] = useState(() => {
        return localStorage.getItem("zalogowanyUser") || null;
    });

    const [rzeczy, setRzeczy] = useState(() => {
        if (zalogowany) {
            const saved = localStorage.getItem(`koszyk_${zalogowany}`);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const [historia, setHistoria] = useState([]);
    const [bazaOpinii, setBazaOpinii] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/data");
                setBazaOpinii(response.data.opinions || []);
                setHistoria(response.data.orders || []);
            } catch (err) {
                console.error("Error connecting to server:", err);
            }
        }
        fetchData();
    }, []);

    function zalogujMnie(name) {
        setZalogowany(name);
        api.get("/data").then(res => {
            setHistoria(res.data.orders);
            setBazaOpinii(res.data.opinions);
        });

        const userCart = JSON.parse(localStorage.getItem(`koszyk_${name}`)) || [];
        setRzeczy(userCart);
    }

    function wylogujMnie() {
        setZalogowany(null);
        localStorage.removeItem("zalogowanyUser");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setRzeczy([]);
        navigate("/");
    }

    async function dodajOpinieGlobalnie(nowaOpinia) {
        try {
            const response = await api.post("/opinions", nowaOpinia);

            setBazaOpinii([...bazaOpinii, response.data]);
            alert("Opinia zapisana w bazie!");
        } catch (error) {
            console.error("Error adding opinion:", error);
            alert("Błąd: Sprawdź czy jesteś zalogowany.");
        }
    }

    async function usunOpinieGlobalnie(idOpinii) {
        try {
            await api.delete(`/opinions/${idOpinii}`);

            setBazaOpinii(bazaOpinii.filter((opinia) => opinia.id !== idOpinii));
        } catch (error) {
            console.error("Error deleting:", error);
            if (error.response && error.response.status === 403) {
                alert("Nie masz uprawnień (tylko Admin lub autor)!");
            } else {
                alert("Błąd serwera.");
            }
        }
    }

    async function zlozZamowienie() {
        if (rzeczy.length === 0) {
            alert("Koszyk pusty!");
            return;
        }

        const price = (rzeczy.reduce((sum, item) => sum + item.quantity * item.price, 0)).toFixed(2);

        const noweZamowienie = {
            id: Date.now(),
            data: new Date().toLocaleString(),
            produkty: [...rzeczy],
            lacznaCena: price,
        };

        try {
            const response = await api.post("/orders", noweZamowienie);
            setHistoria([...historia, response.data]);

            setRzeczy([]);
            localStorage.removeItem(`koszyk_${zalogowany}`);
            alert("Zamówienie złożone!");
            navigate("/profil");
        } catch (error) {
            console.error(error);
            alert("Błąd składania zamówienia");
        }
    }

    useEffect(() => {
        if (zalogowany) {
            localStorage.setItem(`koszyk_${zalogowany}`, JSON.stringify(rzeczy));
        }
    }, [rzeczy, zalogowany]);

    function dodawanieDoKoszyka(produkt, ilosc) {
        const istnieje = rzeczy.find((r) => r.id === produkt.id);
        if (istnieje) {
            setRzeczy(rzeczy.map((r) => r.id === produkt.id ? { ...r, quantity: Number(r.quantity) + Number(ilosc) } : r));
        } else {
            setRzeczy([...rzeczy, { ...produkt, quantity: ilosc }]);
        }
    }

    function zmianaKoszyka(id, nowaIle) {
        if (nowaIle < 1) setRzeczy((curr) => curr.filter((i) => i.id !== id));
        else setRzeczy((curr) => curr.map((i) => i.id === id ? { ...i, quantity: Number(nowaIle) } : i));
    }

    return (
        <>
            <Navbar filtruj={setFiltr} kto={zalogowany} wyloguj={wylogujMnie} />
            <Routes>
                <Route path="/" element={
                    <ProductList
                        Filtr={filtr}
                        dodajDoKoszyka={dodawanieDoKoszyka}
                        kto={zalogowany}
                        wszystkieOpinie={bazaOpinii}
                        dodajOpinieApp={dodajOpinieGlobalnie}
                        usunOpinieApp={usunOpinieGlobalnie}
                    />
                }
                />
                <Route path="/logowanie" element={<Logowanie ustawZalogowany={zalogujMnie} />} />
                <Route path="/rejestracja" element={<Rejestracja />} />
                <Route path="/koszyk" element={
                    <WymaganeLogowanie kto={zalogowany}>
                        <Koszyk zawartosc={rzeczy} zmiana={zmianaKoszyka} />
                    </WymaganeLogowanie>
                }
                />
                <Route path="/podsumowanie" element={
                    <WymaganeLogowanie kto={zalogowany}>
                        <Podsumowanie obliczCene={() => (rzeczy.reduce((s, i) => s + i.quantity * i.price, 0)).toFixed(2)} zlozZamowienie={zlozZamowienie} />
                    </WymaganeLogowanie>
                }
                />
                <Route path="/profil" element={
                    <WymaganeLogowanie kto={zalogowany}>
                        <Profil kto={zalogowany} historia={historia} />
                    </WymaganeLogowanie>
                }
                />
            </Routes>
        </>
    );
}

export default App;