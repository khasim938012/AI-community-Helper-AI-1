import os
import json

class RecommendationEngine:
    """
    AI Recommendation Engine to suggest relevant Schemes, Jobs, and Scholarships
    based on a User Profile (Age, Education, Income, Location).
    """
    def __init__(self, data_dir: str = "../../datasets"):
        self.data_dir = data_dir
        self.schemes = self._load_data("government_schemes/schemes.json")
        self.jobs = self._load_data("government_jobs/jobs.json")
        self.scholarships = self._load_data("scholarships/scholarships.json")

    def _load_data(self, relative_path: str):
        try:
            full_path = os.path.join(self.data_dir, relative_path)
            with open(full_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load data from {relative_path}. Error: {e}")
            return []

    def get_recommendations(self, user_profile: dict) -> dict:
        """
        user_profile structure:
        {
          "age": int,
          "education_level": str,
          "annual_income": float,
          "gender": str,
          "state": str
        }
        """
        age = user_profile.get("age", 25)
        income = user_profile.get("annual_income", 0)
        gender = str(user_profile.get("gender", "")).lower()
        edu = str(user_profile.get("education_level", "")).lower()

        recommended_schemes = []
        recommended_jobs = []
        recommended_scholarships = []

        # 1. Filter Schemes
        for scheme in self.schemes:
            audience = scheme["target_audience"].lower()
            title = scheme["title"].lower()
            
            score = 0
            if "women" in audience and gender in ["female", "woman", "girl"]:
                score += 5
            if "senior" in audience and age > 60:
                score += 5
            if "student" in audience and "class" in edu:
                score += 4
            if "bpl" in audience and income < 250000:
                score += 5
            if "farmer" in audience and "kisan" in title:
                score += 2 # Give base points for general farming just in case
                
            if score > 0 or ("general" in audience):
                if len(recommended_schemes) < 15:
                    recommended_schemes.append(scheme)

        # 2. Filter Scholarships
        for sch in self.scholarships:
            score = 0
            lvl = sch["education_level"].lower()
            if "matric" in lvl and ("10th" in edu or "school" in edu):
                score += 5
            if "undergrad" in lvl and "12th" in edu:
                 score += 5
            
            if score > 0 or ("general" in lvl):
                if len(recommended_scholarships) < 10:
                    recommended_scholarships.append(sch)

        # 3. Filter Jobs
        for job in self.jobs:
            score = 0
            qual = job["qualification"].lower()
            if "10th" in qual and ("10th" in edu or "12th" in edu or "graduate" in edu):
                score += 3
            if "12th" in qual and ("12th" in edu or "graduate" in edu):
                score += 4
            if "graduate" in qual and "graduate" in edu:
                score += 5
                
            if score > 2:
                if len(recommended_jobs) < 10:
                    recommended_jobs.append(job)

        return {
            "top_schemes": recommended_schemes[:5],   # Return top 5
            "top_jobs": recommended_jobs[:5],
            "top_scholarships": recommended_scholarships[:5]
        }
