import sys
import os
from fastapi import APIRouter
from pydantic import BaseModel

# Add ai_models to system path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), "../../../.."))
from ai_models.scam_detection.scam_engine import ScamDetectionEngine

router = APIRouter()
scam_engine = ScamDetectionEngine()

class ScamAnalysisRequest(BaseModel):
    message: str
    links: list = []

@router.post("/analyze")
def analyze_for_scams(request: ScamAnalysisRequest):
    """
    Receives user-provided messages or links.
    Returns the AI Scam Detection analysis (Safe/Suspicious/Scam).
    """
    try:
        analysis = scam_engine.analyze_content(
            text=request.message,
            links=request.links
        )
        return analysis
    except Exception as e:
        return {"status": "error", "message": str(e)}
