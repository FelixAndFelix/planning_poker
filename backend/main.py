from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, List
from session_manager import SessionManager

app = FastAPI(title="Planning Poker API")
session_manager = SessionManager()

class ConnectionManager:
    def __init__(self):
        # session_id -> List[WebSocket]
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)

    def disconnect(self, websocket: WebSocket, session_id: str):
        if session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)

    async def broadcast_session_state(self, session_id: str):
        session = session_manager.get_session(session_id)
        if session and session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                await connection.send_json(session)

manager = ConnectionManager()

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.websocket("/ws/{session_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str, user_id: str, name: str):
    await manager.connect(websocket, session_id)
    session_manager.join_session(session_id, user_id, name)
    await manager.broadcast_session_state(session_id)
    
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "vote":
                session_manager.submit_vote(session_id, user_id, data.get("vote"))
                await manager.broadcast_session_state(session_id)
            elif data.get("type") == "reveal":
                session_manager.reveal_votes(session_id)
                await manager.broadcast_session_state(session_id)
            elif data.get("type") == "reset":
                session_manager.reset_round(session_id)
                await manager.broadcast_session_state(session_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
        session_manager.leave_session(session_id, user_id)
        await manager.broadcast_session_state(session_id)
