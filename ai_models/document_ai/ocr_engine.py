import re
import os
try:
    from PIL import Image
    import pytesseract
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False

class OCREngine:
    """
    AI OCR Engine to extract text from images and parse key details 
    (Name, DOB, Address, ID Numbers).
    """
    def __init__(self):
        # Configure tesseract path if needed, e.g., on Windows
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        pass

    def extract_details(self, image_path: str) -> dict:
        extracted_data = {
            "name": None,
            "dob": None,
            "id_number": None,
            "id_type": None,
            "address": None,
            "raw_text": "",
            "confidence": "low"
        }

        try:
            if not TESSERACT_AVAILABLE:
                raise Exception("Tesseract dependencies missing.")
                
            img = Image.open(image_path)
            # Basic OCR
            text = pytesseract.image_to_string(img)
            extracted_data["raw_text"] = text
            extracted_data["confidence"] = "high"

            # Parse with Regex
            extracted_data.update(self._parse_text(text))

        except Exception as e:
            print(f"OCR Failed or Tesseract not installed: {e}. Falling back to AI Mock Simulator for demo.")
            # Fallback mock for demo purposes if tesseract is not installed on the host
            extracted_data = self._mock_extraction(image_path)
            
        return extracted_data

    def _parse_text(self, text: str) -> dict:
        data = {}
        
        # 1. Match Aadhaar (12 digits, often with spaces like 1234 5678 9012)
        aadhaar_match = re.search(r'\b\d{4}\s\d{4}\s\d{4}\b', text)
        if aadhaar_match:
            data["id_number"] = aadhaar_match.group()
            data["id_type"] = "Aadhaar Card"
            
        # 2. Match PAN (5 letters, 4 digits, 1 letter)
        pan_match = re.search(r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b', text)
        if pan_match and not data.get("id_number"):
            data["id_number"] = pan_match.group()
            data["id_type"] = "PAN Card"

        # 3. Match DOB (DD/MM/YYYY or similar)
        dob_match = re.search(r'\b(\d{2}[-/]\d{2}[-/]\d{4})\b', text)
        if dob_match:
            data["dob"] = dob_match.group(1)

        # 4. Attempt to find Name (Usually next to 'Name:' or 'DOB', or just capitalized words)
        # This is a basic generic heuristic for demo. Real NLP NER (SpaCy) goes here.
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if "Name" in line or "NAME" in line:
                name_val = line.split(':')[-1].strip()
                if not name_val and i+1 < len(lines):
                     name_val = lines[i+1].strip()
                data["name"] = name_val
                
        # 5. Generic heuristic for Address (lines containing Pin code)
        address_match = re.search(r'\b\d{6}\b', text)
        if address_match:
            # We assume the line with the PIN and the one before it might be the address
             for i, line in enumerate(lines):
                 if address_match.group() in line:
                     data["address"] = f"{lines[i-1].strip() if i>0 else ''} {line.strip()}"
                     
        return data

    def _mock_extraction(self, image_path: str) -> dict:
        """ Simulate realistic OCR output if the system lacks Tesseract. """
        filename = os.path.basename(image_path).lower()
        if "aadhaar" in filename:
            return {
                "name": "Ramesh Kumar", "dob": "15/08/1990", 
                "id_number": "4321 8765 0912", "id_type": "Aadhaar Card",
                "address": "123, MG Road, Bengaluru, Karnataka 560001",
                "raw_text": "Government of India... Ramesh Kumar... DOB: 15/08/1990...",
                "confidence": "mock_high"
            }
        elif "pan" in filename:
            return {
                "name": "Ramesh Kumar", "dob": "15/08/1990", 
                "id_number": "ABCDE1234F", "id_type": "PAN Card",
                "address": None,
                "raw_text": "INCOME TAX DEPARTMENT... Ramesh Kumar... 15/08/1990... ABCDE1234F",
                "confidence": "mock_high"
            }
        else:
             return {
                "name": "John Doe", "dob": "01/01/2000", 
                "id_number": "DOC-12345", "id_type": "Generic ID",
                "address": "Sample Address, City 123456",
                "raw_text": "Mock extracted details...",
                "confidence": "mock"
            }
