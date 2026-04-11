from fastapi import FastAPI

app = FastAPI(title="Planning Poker API")

@app.get("/health")
def health_check():
    return {"status": "ok"}
