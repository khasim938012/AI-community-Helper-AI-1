from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_schemes():
    return [
        {"id": 1, "title": "PM Kisan Samman Nidhi"},
        {"id": 2, "title": "Ayushman Bharat"}
    ]

@router.get("/{scheme_id}")
def get_scheme(scheme_id: int):
    return {"id": scheme_id, "title": "Scheme details placeholder"}
