import sys
import os
import shutil
import json
from fastapi import APIRouter, UploadFile, File

from pydantic import BaseModel
# Add ai_models to system path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), "../../../.."))
from ai_models.document_ai.ocr_engine import OCREngine
from ai_models.document_ai.autofill_engine import FormAutofillEngine

router = APIRouter()
SCHEMES_FILE = os.path.join(os.path.dirname(__file__), "../../../../datasets/government_schemes/schemes.json")
ocr_engine = OCREngine()
autofill_engine = FormAutofillEngine()

UPLOAD_DIR = "app/static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mock DB for Document Retention System (Step 15)
# In production, this would be a postgres DB securely linking user_id to verified S3 document URIs
USER_RETAINED_DOCS = {
    # e.g., "id_type" -> { "parsed_data", "url" }
}

@router.get("/my-documents")
def get_user_documents():
    """
    Returns the documents previously verified and saved for the user.
    """
    return {
        "status": "success",
        "verified_documents": USER_RETAINED_DOCS
    }

@router.post("/upload")
def upload_document(file: UploadFile = File(...)):
    """
    Receives an image document, saves it temporarily, 
    and passes it to the AI OCR Engine for data extraction.
    """
    try:
        file_location = os.path.join(UPLOAD_DIR, file.filename)
        
        # Save file
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
            
        # Run AI OCR Pipeline
        extracted_data = ocr_engine.extract_details(file_location)
        
        # Step 15: Document Retention
        doc_type = extracted_data.get("id_type")
        if doc_type:
            USER_RETAINED_DOCS[doc_type] = {
                "extracted_data": extracted_data,
                "url": f"/static/uploads/{file.filename}"
            }
        elif "Income" in extracted_data.get("raw_text", ""):
            USER_RETAINED_DOCS["Income Certificate"] = {
                "extracted_data": extracted_data,
                "url": f"/static/uploads/{file.filename}"
            }
        
        return {
            "status": "success",
            "filename": file.filename,
            "extracted_data": extracted_data,
            "retained_docs": list(USER_RETAINED_DOCS.keys())
        }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

class AutoFillRequest(BaseModel):
    application_type: str
    user_data: dict

@router.post("/generate-form")
def auto_fill_form(request: AutoFillRequest):
    """
    Takes validated user data, passes it to the Autofill Engine,
    and returns a downloadable, pre-filled PDF form.
    """
    try:
        pdf_url = autofill_engine.generate_filled_form(
            application_type=request.application_type,
            user_data=request.user_data
        )
        return {
            "status": "success",
            "message": "Form pre-filled successfully via AI.",
            "download_url": f"http://localhost:8000{pdf_url}"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/api/schemes/all")
async def get_all_schemes():
    """Returns the full list of 100+ government schemes."""
    if os.path.exists(SCHEMES_FILE):
        with open(SCHEMES_FILE, 'r', encoding='utf-8') as f:
            schemes = json.load(f)
            return {"status": "success", "data": schemes}
    return {"status": "error", "message": "Schemes database not found", "data": []}

class EligibilityRequest(BaseModel):
    scheme_title: str

@router.post("/check-eligibility")
def check_scheme_eligibility(request: EligibilityRequest):
    """
    Checks the retained documents against the scheme requirements constraints.
    """
    required_docs = ["Aadhaar Card"]  # Fallback minimum
    
    # Try to fetch actual requirements from the DB
    try:
        if os.path.exists(SCHEMES_FILE):
            with open(SCHEMES_FILE, 'r', encoding='utf-8') as f:
                schemes = json.load(f)
                for s in schemes:
                    if s.get("title") == request.scheme_title:
                        # Sometimes datasets use different keys, fallback to safe parsing
                        docs = s.get("documents_required", [])
                        if docs:
                            required_docs = docs
                        break
    except Exception as e:
        print(f"Error reading scheme requirements: {e}")
        
    # If it fell back to just Aadhaar, try to infer others
    if len(required_docs) == 1:
        if "Kisan" in request.scheme_title or "Farmer" in request.scheme_title:
            required_docs.append("Land Record")
        if "Income" in request.scheme_title or "BPL" in request.scheme_title or "Ayushman" in request.scheme_title:
            required_docs.append("Income Certificate")
        
    missing_docs = []
    for doc in required_docs:
        # Our OCR extracts specific document types, we do a fuzzy match against retained keys
        found = False
        doc_str = str(doc)
        for retained in USER_RETAINED_DOCS.keys():
            retained_str = str(retained)
            if "".join(doc_str.split()).lower() in "".join(retained_str.split()).lower() or "".join(retained_str.split()).lower() in "".join(doc_str.split()).lower() or doc_str in retained_str:
                found = True
                break
        if not found:
            missing_docs.append(doc_str)
            
    is_eligible = len(missing_docs) == 0
    
    return {
        "status": "success",
        "scheme": request.scheme_title,
        "is_eligible": is_eligible,
        "required_docs": required_docs,
        "missing_docs": missing_docs,
        "retained_docs": list(USER_RETAINED_DOCS.keys()),
        "message": "Eligible to apply!" if is_eligible else f"Missing documents: {', '.join(missing_docs)}"
    }
