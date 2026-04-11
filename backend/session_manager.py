from typing import Dict, Optional

class SessionManager:
    def __init__(self):
        # session_id -> { "users": { user_id: { "name": str, "vote": Optional[str] } } }
        self.sessions: Dict[str, dict] = {}

    def join_session(self, session_id: str, user_id: str, user_name: str):
        if session_id not in self.sessions:
            self.sessions[session_id] = {"users": {}, "revealed": False}
        
        self.sessions[session_id]["users"][user_id] = {
            "name": user_name,
            "vote": None
        }

    def submit_vote(self, session_id: str, user_id: str, vote: str):
        if session_id in self.sessions and user_id in self.sessions[session_id]["users"]:
            self.sessions[session_id]["users"][user_id]["vote"] = vote

    def get_session(self, session_id: str) -> Optional[dict]:
        return self.sessions.get(session_id)

    def reveal_votes(self, session_id: str):
        if session_id in self.sessions:
            self.sessions[session_id]["revealed"] = True

    def reset_round(self, session_id: str):
        if session_id in self.sessions:
            self.sessions[session_id]["revealed"] = False
            for user in self.sessions[session_id]["users"].values():
                user["vote"] = None
