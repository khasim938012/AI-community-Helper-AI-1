import sys
import os
import uuid
from fastapi import APIRouter
from pydantic import BaseModel
from gtts import gTTS

# Add ai_models to system path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), "../../../.."))
from ai_models.chatbot.engine import GovernmentChatbotEngine

router = APIRouter()

# Initialize Chat Engine globally (or using dependency injection in FastAPI)
chat_engine = GovernmentChatbotEngine(data_dir=os.path.join(os.path.dirname(__file__), "../../../../../datasets"))

class ChatRequest(BaseModel):
    message: str
    language: str = "en"

@router.post("/ask")
def chat_with_ai(request: ChatRequest):
    """
    Main endpoint for the Voice Assistant and Chat UI.
    Receives user query, processes via NLP engine, returns reply and actions.
    """
    response_data = chat_engine.process_query(request.message, request.language)
    
    # Generate TTS Audio
    # Mapping of frontend language codes to gTTS language codes
    lang_map = {
        "en": "en",
        "hi": "hi",
        "kn": "kn",
        "te": "te",
        "mr": "mr"
    }
    
    tts_lang = lang_map.get(request.language.lower(), "en")
    
    audio_filename = f"{uuid.uuid4()}.mp3"
    audio_filepath = os.path.join("app", "static", "audio", audio_filename)
    
    try:
        tts = gTTS(text=response_data["reply"], lang=tts_lang)
        tts.save(audio_filepath)
        audio_url = f"http://localhost:8000/static/audio/{audio_filename}"
    except Exception as e:
        print(f"TTS Error: {e}")
        audio_url = None
        
    return {
        "reply": response_data["reply"],
        "action": response_data.get("action"),
        "context_data": response_data.get("context_data"),
        "language": request.language,
        "audio_url": audio_url
    }
