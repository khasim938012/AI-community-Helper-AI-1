import sys
import os
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

# Add ai_models to system path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), "../../../.."))
from ai_models.recommendation_engine.recommender import RecommendationEngine

router = APIRouter()
# Instantiate Recommender globally
recommender_engine = RecommendationEngine(data_dir=os.path.join(os.path.dirname(__file__), "../../../../../datasets"))

class UserProfile(BaseModel):
    age: Optional[int] = 25
    education_level: Optional[str] = "12th Pass"
    annual_income: Optional[float] = 100000.0
    gender: Optional[str] = "male"
    state: Optional[str] = "All India"

@router.post("/suggest")
def get_recommendations(profile: UserProfile):
    """
    Accepts a user demographic payload.
    Returns highly targeted, scored schemes, jobs, and scholarships.
    """
    try:
        suggestions = recommender_engine.get_recommendations(profile.dict())
        return {
            "status": "success",
            "data": suggestions
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
