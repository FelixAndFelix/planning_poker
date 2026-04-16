# Interne Entwicklerdokumentation (dev_docs.md)

Diese Dokumentation richtet sich an Entwickler, die an der Wartung und Erweiterung der Planning Poker Anwendung arbeiten.

## Service-Architektur
Die Anwendung basiert auf einer containerisierten Architektur, die Frontend und Backend in einem einzigen Docker-Image vereint.

- **Frontend:** Eine React-Single-Page-Application (SPA) mit TypeScript und Vite. Im Produktivbetrieb wird das Frontend als statischer Content von Nginx ausgeliefert.
- **Backend:** Ein FastAPI-Server (Python 3.13), der die Geschäftslogik, Teilnehmerverwaltung und Abstimmungsprozesse im Arbeitsspeicher verwaltet.
- **Infrastruktur:** Nginx fungiert als Reverse Proxy und Entrypoint. Er routet Anfragen an das statische Frontend oder leitet API- und WebSocket-Anfragen an den FastAPI-Server weiter.

## Netzwerk & Ports
Die Anwendung ist für den Betrieb in einem Docker-Container vorkonfiguriert.

| Dienst | Interner Port (Docker) | Exposed Port (Host) | Protokoll | Zweck |
| :--- | :--- | :--- | :--- | :--- |
| **Nginx** | `80` | `80` | HTTP | Haupteinstiegspunkt (Frontend & Proxy) |
| **FastAPI** | `8000` | - | HTTP / WS | Internes Backend (erreichbar via Nginx) |

*Hinweis: In der lokalen Entwicklungsumgebung ohne Docker nutzt das Frontend standardmäßig Port `5173` (Vite).*

## API-Referenz
Die API ist nach dem REST-Prinzip für Health-Checks und WebSockets für die Echtzeit-Interaktion aufgebaut.

| Pfad | Methode | Zweck |
| :--- | :--- | :--- |
| `/health` | `GET` | System-Check: Prüft die Verfügbarkeit des Backends. |
| `/ws/{session_id}/{user_id}` | `WS` | Initialisiert die WebSocket-Verbindung für eine Session (erfordert `name` als Query-Parameter). |

### WebSocket-Nachrichten (Payloads)
Die Kommunikation erfolgt bidirektional im JSON-Format.

**Client an Server:**
- `{"type": "vote", "vote": "value"}`: Sendet eine Stimme ab.
- `{"type": "reveal"}`: Deckt alle Karten in der aktuellen Session auf.
- `{"type": "reset"}`: Startet eine neue Abstimmungsrunde.

**Server an Client:**
Der Server sendet bei jeder Änderung den vollständigen Sitzungsstatus (Session-Objekt) an alle Teilnehmer.

## Datenfluss-Schema
1. **Initialisierung:** Das Frontend lädt statische Assets über Nginx.
2. **Verbindung:** Das Frontend baut eine WebSocket-Verbindung über `/ws/...` auf, die von Nginx an Port 8000 weitergeleitet wird.
3. **Zustandsverwaltung:** Der `SessionManager` im Backend aktualisiert den In-Memory-State bei eingehenden Nachrichten.
4. **Synchronisation:** Nach jeder Änderung broadcastet der `ConnectionManager` den neuen Zustand an alle verbundenen Clients der Session.

---
*Letzte Aktualisierung: April 2026*
