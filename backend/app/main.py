from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, schemes, jobs, docs, chatbot, scam_detector, recommender, location

app = FastAPI(
    title="AI Government Assistant API",
    description="Backend API for the AI Government Assistant Platform",
    version="1.0.0"
)

from fastapi.staticfiles import StaticFiles
from fastapi.middleware.gzip import GZipMiddleware

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Step 13: LOW BANDWIDTH OPTIMIZATION - Compress all responses down to minimum size
app.add_middleware(GZipMiddleware, minimum_size=500)

# Mount static files for audio
import os
os.makedirs("app/static/audio", exist_ok=True)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(schemes.router, prefix="/api/schemes", tags=["Government Schemes"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Government Jobs"])
app.include_router(docs.router, prefix="/api/docs", tags=["Document AI & Forms"])
app.include_router(chatbot.router, prefix="/api/chat", tags=["AI Chatbot"])
app.include_router(scam_detector.router, prefix="/api/scam-detector", tags=["AI Scam Detection"])
app.include_router(recommender.router, prefix="/api/recommendations", tags=["AI Recommendation Engine"])
app.include_router(location.router, prefix="/api/location", tags=["GPS Services"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI Government Assistant API is running"}
