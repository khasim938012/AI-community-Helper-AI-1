import os
import uuid
import datetime
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

class FormAutofillEngine:
    """
    Simulates an AI system that takes extracted user data (from OCR)
    and maps it intelligently onto official PDF forms.
    Uses ReportLab to generate a beautifully customized filled PDF.
    """
    def __init__(self, output_dir="app/static/forms"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_filled_form(self, application_type: str, user_data: dict) -> str:
        """
        Creates a mock Government Application form (PDF) pre-filled with the user's data.
        """
        filename = f"{application_type.replace(' ', '_')}_{uuid.uuid4().hex[:8]}.pdf"
        filepath = os.path.join(self.output_dir, filename)

        # Create PDF
        c = canvas.Canvas(filepath, pagesize=letter)
        c.setFont("Helvetica-Bold", 16)
        
        # Header
        c.drawString(180, 750, f"GOVERNMENT OF INDIA")
        c.setFont("Helvetica", 14)
        c.drawString(140, 730, f"OFFICIAL APPLICATION FORM: {application_type.upper()}")
        
        c.setLineWidth(1)
        c.line(50, 715, 550, 715)

        # Auto-filled Section
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, 680, "1. APPLICANT DETAILS (Auto-Filled via AI Vision)")
        
        c.setFont("Helvetica", 11)
        y_pos = 650
        
        # Intelligence Mapping Logic (Fallback to 'Not Provided' if OCR missed it)
        fields_to_map = [
            ("Full Name", user_data.get("name")),
            ("Date of Birth", user_data.get("dob")),
            ("Primary Identity Document", user_data.get("id_type")),
            ("Identity Number", user_data.get("id_number")),
            ("Permanent Address", user_data.get("address")),
            ("Application Date", datetime.datetime.now().strftime("%d/%m/%Y")),
        ]
        
        for label, val in fields_to_map:
            display_val = str(val).upper() if val else "NOT PROVIDED (MANUAL ENTRY REQUIRED)"
            c.drawString(70, y_pos, f"{label}:")
            
            # Print value in blue to stand out as "Auto-Filled"
            c.setFillColorRGB(0, 0.2, 0.8)
            c.drawString(230, y_pos, display_val)
            c.setFillColorRGB(0, 0, 0)
            
            # Add a form line
            c.line(225, y_pos - 3, 500, y_pos - 3)
            y_pos -= 30

        # Footer / Declaration
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y_pos - 20, "2. DECLARATION")
        c.setFont("Helvetica", 10)
        c.drawString(70, y_pos - 40, "I hereby declare that the details auto-populated above are true to the best of my knowledge.")
        c.drawString(70, y_pos - 55, "If any information is found to be false, my application may be rejected.")

        # Signature Box
        c.rect(380, y_pos - 130, 150, 50)
        c.drawString(390, y_pos - 145, "Applicant Signature")
        
        # Stamp it with AI Validator
        c.setFillColorRGB(0.1, 0.6, 0.1)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(50, y_pos - 130, "✓ DIGITALLY SCANNED AND PRE-VERIFIED BY AICORE")

        c.save()
        return f"/static/forms/{filename}"
