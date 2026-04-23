# Planning Poker App

Echtzeit-Anwendung zur kollaborativen Aufwandsschätzung in agilen Teams. Die Anwendung ermöglicht es Teams, Schätzrunden synchron und effizient über verteilte Standorte hinweg durchzuführen.

## Features
- **Echtzeit-Lobby:** Synchronisierte Teilnehmerliste und Abstimmungsstatus via WebSockets.
- **Kartendeck:** Unterstützung der Fibonacci-Folge (0, 1, 2, 3, 5, 8, 13, 21) sowie einer Skip-Option.
- **Smart Reveal:** Gleichzeitige Offenlegung aller Stimmen und automatischer Durchschnittsberechnung (ohne Skip-Votes).
- **Session-Management:** Einfaches Erstellen und Beitreten von Lobbys über eindeutige IDs.
- **Mobile-First:** Vollständig responsives UI für die Nutzung auf Smartphones und Tablets.

## Tech Stack
| Bereich | Technologie | Version |
| :--- | :--- | :--- |
| **Backend** | Python / FastAPI | 3.12+ / 0.135.x |
| **Frontend** | React / Vite / TS | 19.x / 8.x |
| **Realtime** | WebSockets | Standard RFC 6455 |
| **Testing** | Pytest / Vitest | 9.x / 4.x |

## Deployment (Docker)

Die Anwendung kann als ein einzelnes, optimiertes Docker-Image bereitgestellt werden, das sowohl das Frontend (via Nginx) als auch das Backend (via FastAPI) enthält.

### 1. Image bauen
Führen Sie den folgenden Befehl im Hauptverzeichnis des Projekts aus:
```bash
docker build -t planning-poker .
```

### 2. Container starten
Starten Sie den Container und mappen Sie den internen Port 80 auf den gewünschten Host-Port (z.B. `2323`):
```bash
docker run -d -p 2323:80 --name planning-poker planning-poker
```
Die Anwendung ist nun unter `http://localhost:2323` erreichbar.

## Infrastruktur & Ports
| Dienst | Port | Protokoll | Zweck |
| :--- | :--- | :--- | :--- |
| **Unified App (Docker)** | `2323` | HTTP | Frontend & API (via Nginx Proxy) |
| **Backend (Standalone)** | `8000` | HTTP/WS | API-Endpunkte & WebSocket-Server |
| **Frontend (Dev)** | `5173` | HTTP | Vite Development Server |

## Voraussetzungen
- **Python 3.12+**
- **Node.js 20+**
- Aktiver Paketmanager (**npm**)

## Installation & Start

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Unix/macOS
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Die Anwendung ist unter `http://localhost:5173` erreichbar.

## Architektur-Notizen
Die Kommunikation folgt einem **Ereignis-gesteuerten WebSocket-Modell**. Das Backend verwaltet den Zustand (`revealed`, `votes`, `average`) vollständig **in-memory** im `SessionManager`. 
1. **Client** sendet Aktionen (Join, Vote, Reveal) als JSON-Nachrichten.
2. **Server** validiert die Aktion und aktualisiert den Session-Status.
3. **Server** broadcastet den neuen Gesamtzustand an alle verbundenen WebSockets der Session.


## Autoren
- [@einermitW](https://github.com/einermitw)
- [@kargfel](https://github.com/kargfel)


## Lizenz
Standard-Platzhalter: [MIT License](LICENSE)
