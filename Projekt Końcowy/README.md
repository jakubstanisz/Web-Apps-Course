# 🛒 Sklep Internetowy (Full Stack React + Node.js)

Projekt zaliczeniowy przedstawiający w pełni funkcjonalną aplikację sklepu internetowego. System składa się z warstwy klienckiej (Frontend) oraz serwerowej (Backend) z własnym API i systemem autoryzacji JWT.

---

## 🛠️ Użyte Technologie i Biblioteki

### Frontend (Klient)
* **React** - biblioteka do budowania interfejsu.
* **React Router DOM** - nawigacja (routing) po stronie klienta.
* **Axios** - komunikacja z API (pobieranie produktów, wysyłanie zamówień).
* **Material UI (MUI)** - biblioteka gotowych komponentów (przyciski, ikony, formularze).
* **Vite** - narzędzie do budowania i uruchamiania projektu.

### Backend (Serwer)
* **Node.js** - środowisko uruchomieniowe.
* **Express** - framework serwerowy.
* **JSON Web Token (jsonwebtoken)** - obsługa bezpiecznego logowania (Access Token + Refresh Token).
* **CORS** - obsługa zapytań międzydomenowych.
* **FS (File System)** - obsługa prostej bazy danych opartej na pliku JSON.

### Baza Danych
* **Plik `db.json`** - przechowuje użytkowników, opinie, zamówienia i aktywne tokeny sesji.

---

## ⚙️ Funkcjonalności

1.  **System Użytkowników:**
    * Rejestracja nowych kont.
    * Logowanie z walidacją danych.
    * Automatyczne odświeżanie sesji (Refresh Token) w tle.
    * Wylogowanie.

2.  **Produkty:**
    * Wyświetlanie listy produktów pobieranej z zewnętrznego API / bazy.
    * Filtrowanie produktów po nazwie.
    * Szczegóły produktu.

3.  **Koszyk Zakupowy:**
    * Dodawanie produktów do koszyka.
    * Zmiana ilości sztuk (+/-).
    * Usuwanie produktów.
    * Dynamiczne obliczanie sumy do zapłaty.
    * Zapisywanie stanu koszyka w pamięci przeglądarki (LocalStorage).

4.  **Opinie i Recenzje (RBAC - Role Based Access Control):**
    * Dodawanie opinii (tylko dla zalogowanych użytkowników).
    * **Uprawnienia usuwania:**
        * Zwykły użytkownik może usunąć **tylko swoją** opinię.
        * Administrator (konto `prowadzacy`) może usunąć **każdą** opinię.

5.  **Zamówienia:**
    * Składanie zamówienia (zapis do bazy danych).
    * Podgląd historii zamówień w profilu użytkownika.

---

## 🚀 Setup Projektu (Instrukcja Uruchomienia)

Projekt wymaga uruchomienia dwóch terminali – jednego dla serwera, drugiego dla klienta.

### Krok 1: Uruchomienie Backend'u (Serwer)
1.  Otwórz terminal w folderze projektu.
2.  Zainstaluj wymagane biblioteki:
    ```bash
    npm install
    ```
3.  Uruchom serwer (domyślnie na porcie 3000):
    ```bash
    node server.js
    ```

### Krok 2: Uruchomienie Frontend'u (Aplikacja)
1.  Otwórz **nowy** terminal w tym samym folderze.
2.  Uruchom aplikację React:
    ```bash
    npm run dev
    ```
3.  Otwórz link wyświetlony w terminalu (zazwyczaj `http://localhost:5173`).

---

## 📡 Dokumentacja API (Postman)

W repozytorium znajduje się plik **`Sklep_Projekt.postman_collection.json`**. Jest to gotowa kolekcja zapytań umożliwiająca przetestowanie backendu bez użycia przeglądarki.

### Jak użyć?
1.  Pobierz aplikację [Postman](https://www.postman.com/).
2.  Kliknij przycisk **Import** w lewym górnym rogu.
3.  Wybierz plik `.json` z tego folderu.

### Co zawiera kolekcja?
* **Auth:** Zapytania do rejestracji, logowania i odświeżania tokena (`/refresh`).
* **Data:** Pobieranie danych o produktach i opiniach (`GET /data`).
* **Opinions:** Testowanie dodawania i usuwania opinii (sprawdzanie czy działają blokady dla nieuprawnionych użytkowników).
* **Orders:** Symulacja składania zamówienia.

---

## 🔑 Konta Testowe

W bazie danych (`db.json`) przygotowano konta do testowania ról:

| Rola | Login | Hasło | Uprawnienia |
| :--- | :--- | :--- | :--- |
| **Administrator** | `prowadzacy` | `arbuz` | Pełny dostęp, usuwanie wszystkich komentarzy. |
| **Użytkownik** | `gruby` | `123` | Zakupy, dodawanie opinii, usuwanie własnych opinii. |
| **Użytkownik** | `lysy` | `labodega` | Zakupy, dodawanie opinii, usuwanie własnych opinii. |

---

