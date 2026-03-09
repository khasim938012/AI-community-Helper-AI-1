import sys
import os
import random
from fastapi import APIRouter
from pydantic import BaseModel
import math

router = APIRouter()

class LocationRequest(BaseModel):
    latitude: float
    longitude: float
    radius_km: float = 5.0

def generate_mock_locations(lat: float, lon: float, radius: float):
    """
    Simulates finding nearby Government Facilities based on user's GPS coords.
    In a real app, this would query Google Places API or an Indian Govt GIS database.
    """
    facility_types = ["Hospital", "Police Station", "Employment Exchange", "Skill Center", "Government Office"]
    locations = []
    
    # Generate 10-15 random nearby mock facilities
    num_facilities = random.randint(10, 15)
    for i in range(num_facilities):
        # 1 degree lat/lon is roughly 111km. Offset by random distance within radius.
        lat_offset = (random.uniform(-1, 1) * radius) / 111.0
        lon_offset = (random.uniform(-1, 1) * radius) / (111.0 * math.cos(math.radians(lat)))
        
        fac_type = random.choice(facility_types)
        distance = round(random.uniform(0.1, radius), 1)
        
        locations.append({
            "id": f"LOC-{i:03d}",
            "name": f"Government {fac_type} - Branch {random.randint(1, 100)}",
            "type": fac_type,
            "latitude": lat + lat_offset,
            "longitude": lon + lon_offset,
            "distance_km": distance,
            "status": "Open 24/7" if fac_type in ["Hospital", "Police Station"] else "Open 10 AM - 5 PM"
        })
        
    # Sort by distance
    locations.sort(key=lambda x: x["distance_km"])
    return locations

@router.post("/nearby")
def get_nearby_services(request: LocationRequest):
    """
    Returns a list of government services near the provided GPS coordinates.
    """
    try:
        nearby_data = generate_mock_locations(
            lat=request.latitude, 
            lon=request.longitude, 
            radius=request.radius_km
        )
        return {
            "status": "success",
            "search_center": {"lat": request.latitude, "lon": request.longitude},
            "radius_km": request.radius_km,
            "results": nearby_data
        }
    except Exception as e:
         return {"status": "error", "message": str(e)}
