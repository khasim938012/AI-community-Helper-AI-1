from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_jobs():
    return [
        {"id": 1, "title": "Indian Army Agniveer"},
        {"id": 2, "title": "SSC CGL"}
    ]
