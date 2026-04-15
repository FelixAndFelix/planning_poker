import pytest
import sys
import os

# Add the parent directory to sys.path to allow importing session_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from session_manager import SessionManager

def test_session_manager_create_and_join():
    manager = SessionManager()
    session_id = "test-session"
    user_id = "user-1"
    user_name = "Alice"
    
    # Alice joins (creates session if not exists)
    manager.join_session(session_id, user_id, user_name)
    
    session = manager.get_session(session_id)
    assert session is not None
    assert len(session["users"]) == 1
    assert session["users"][user_id]["name"] == user_name
    assert session["users"][user_id]["vote"] is None

def test_session_manager_multiple_users():
    manager = SessionManager()
    session_id = "test-session"
    
    manager.join_session(session_id, "user-1", "Alice")
    manager.join_session(session_id, "user-2", "Bob")
    
    session = manager.get_session(session_id)
    assert len(session["users"]) == 2
    assert session["users"]["user-1"]["name"] == "Alice"
    assert session["users"]["user-2"]["name"] == "Bob"

def test_session_manager_vote():
    manager = SessionManager()
    session_id = "test-session"
    
    manager.join_session(session_id, "user-1", "Alice")
    manager.submit_vote(session_id, "user-1", "5")
    
    session = manager.get_session(session_id)
    assert session["users"]["user-1"]["vote"] == "5"

def test_session_manager_reveal_and_reset():
    manager = SessionManager()
    session_id = "test-session"
    
    manager.join_session(session_id, "user-1", "Alice")
    manager.join_session(session_id, "user-2", "Bob")
    manager.join_session(session_id, "user-3", "Charlie")
    
    manager.submit_vote(session_id, "user-1", "5")
    manager.submit_vote(session_id, "user-2", "8")
    manager.submit_vote(session_id, "user-3", "Skip")
    
    # Reveal
    manager.reveal_votes(session_id)
    session = manager.get_session(session_id)
    assert session["revealed"] is True
    # (5 + 8) / 2 = 6.5
    assert session["average"] == 6.5
    
    # Reset
    manager.reset_round(session_id)
    session = manager.get_session(session_id)
    assert session["revealed"] is False
    assert session["average"] is None
    assert session["users"]["user-1"]["vote"] is None
    assert session["users"]["user-2"]["vote"] is None
    assert session["users"]["user-3"]["vote"] is None
