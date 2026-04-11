from fastapi.testclient import TestClient
import pytest
import sys
import os

# Add the parent directory to sys.path to allow importing main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_websocket_connection():
    with client.websocket_connect("/ws/test-session/user-1?name=Alice") as websocket:
        data = websocket.receive_json()
        assert "users" in data
        assert data["users"]["user-1"]["name"] == "Alice"

def test_websocket_broadcast():
    with client.websocket_connect("/ws/test-session/user-1?name=Alice") as ws1:
        _ = ws1.receive_json() # Initial state
        
        with client.websocket_connect("/ws/test-session/user-2?name=Bob") as ws2:
            data2 = ws2.receive_json() # Bob's initial state
            assert "user-1" in data2["users"]
            assert "user-2" in data2["users"]
            
            # ws1 should receive Bob's join update
            data1 = ws1.receive_json()
            assert "user-2" in data1["users"]
