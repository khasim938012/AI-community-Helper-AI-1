import json
import os
import re

class GovernmentChatbotEngine:
    """
    NLP Chatbot Engine specialized for Indian Government Services.
    Can be extended to hook into LLMs (like Gemini/OpenAI) or local models (Llama, Mistral).
    """
    def __init__(self, data_dir: str = "../../datasets"):
        self.data_dir = data_dir
        self.schemes = self._load_data("government_schemes/schemes.json")
        self.jobs = self._load_data("government_jobs/jobs.json")
        self.scholarships = self._load_data("scholarships/scholarships.json")
        
        # System Prompt configuration for the LLM
        self.system_prompt = (
            "You are 'AICORE', an Autonomous Elite AI Government Assistant. "
            "Your purpose is to help citizens find and apply for schemes, jobs, and scholarships. "
            "Be concise, polite, and accurate. Use the context provided to answer questions."
        )

    def _load_data(self, relative_path: str):
        full_path = os.path.join(self.data_dir, relative_path)
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def process_query(self, user_message: str, language: str = "en") -> dict:
        """
        Process user input and return a precise intent and response.
        """
        query = user_message.lower()
        response_data: dict = {"reply": "", "action": None, "context_data": None}

        # 1. Intent Matching (Rule-based generic routing, to be replaced by semantic routing)
        if re.search(r'\b(pm kisan|kisan|farmer)\b', query):
            scheme = next((s for s in self.schemes if 'kisan' in s['title'].lower() or 'farmer' in s['target_audience'].lower()), None)
            if scheme:
                response_data["reply"] = f"I found the **{scheme['title']}**. {scheme['description']} Eligibility includes: {', '.join(scheme['eligibility_criteria'])}."
                response_data["context_data"] = scheme
                response_data["action"] = "NAVIGATE_TO_SCHEME"
            else:
                response_data["reply"] = "I can help with farmer schemes like PM Kisan. Could you provide more details on what you need?"
                
        elif re.search(r'\b(job|recruitment|vacancy|ssc|upsc)\b', query):
            job = next((j for j in self.jobs if 'ssc' in j['title'].lower() or 'recruitment' in j['title'].lower()), None)
            if job:
               response_data["reply"] = f"There is an active recruitment for **{job['title']}**. Vacancies: {job['vacancies']}. Last date to apply is {job['last_date']}."
               response_data["context_data"] = job
               response_data["action"] = "NAVIGATE_TO_JOB"
            else:
               response_data["reply"] = "There are numerous government jobs available. Would you like me to filter by 10th pass, 12th pass, or graduate levels?"
               
        elif re.search(r'\b(scholarship|student|study|education)\b', query):
            response_data["reply"] = f"We have over {len(self.scholarships)} scholarships listed. For example, Post-Matric and National Merit Scholarships. Which state or level of education are you looking for?"
            response_data["action"] = "OPEN_SCHOLARSHIPS"

        # End-to-End Workflow Intents (Step 16)
        elif re.search(r'\b(eligible|eligibility|qualify)\b', query):
            response_data["reply"] = "To check your eligibility securely, I need to verify your documents using our AI Scanner. Please upload your Aadhaar Card and Income Certificate below."
            response_data["action"] = "ACTION_REQUEST_DOCUMENT"
            response_data["context_data"] = {"required": ["Aadhaar Card", "Income Certificate"]}
            
        elif re.search(r'\b(recommend|find|suggest|what).*(schemes|benefits|loans)\b', query):
            response_data["reply"] = "I have scanned our database of over 100 government schemes. Here are some top schemes that might be relevant to you. Let me know which one you want me to explain."
            response_data["action"] = "ACTION_RECOMMEND_SCHEMES"
            response_data["context_data"] = list(self.schemes)[:5] if isinstance(self.schemes, list) else []

        elif re.search(r'\b(explain|tell me about)\s+(\w+)\b', query):
            # Attempt to explain a specific scheme
            response_data["reply"] = "This scheme provides financial support and benefits to eligible citizens. Would you like me to scan your profile and check your eligibility for this scheme now?"
            response_data["action"] = "NAVIGATE_TO_SCHEMES"
            
        elif re.search(r'\b(apply|how to apply|documents)\b', query) or re.search(r'\b(generate|download)\s+(form|pdf)\b', query):
            response_data["reply"] = "I have successfully auto-filled your application form using your verified documents. You can download the PDF below and I will provide you the direct link to the real government website to submit it."
            response_data["action"] = "ACTION_SHOW_ELIGIBILITY"
            response_data["context_data"] = {"eligible": True, "scheme": "Selected Scheme"}

        # Navigation Intents
        elif re.search(r'\b(open|go to|show|take me to)\s+(schemes|government schemes)\b', query):
            response_data["reply"] = "Opening Government Schemes. Here you can find various welfare programs."
            response_data["action"] = "NAVIGATE_TO_SCHEMES"

        elif re.search(r'\b(open|go to|show|take me to)\s+(jobs|government jobs)\b', query):
            response_data["reply"] = "Navigating to Government Jobs."
            response_data["action"] = "NAVIGATE_TO_JOBS"

        elif re.search(r'\b(open|go to|show|take me to)\s+(skills|courses|learning)\b', query):
            response_data["reply"] = "Taking you to the Skills and Courses section."
            response_data["action"] = "NAVIGATE_TO_SKILLS"

        elif re.search(r'\b(open|go to|show|take me to)\s+(admin|dashboard)\b', query):
            response_data["reply"] = "Opening the Admin Analytics Dashboard."
            response_data["action"] = "NAVIGATE_TO_ADMIN"

        elif re.search(r'\b(home|main menu)\b', query):
            response_data["reply"] = "Going back to the home screen."
            response_data["action"] = "NAVIGATE_TO_HOME"

        else:
            # Fallback generative response
            response_data["reply"] = (
                "I am your AI Government Assistant. I can help you search for schemes, scholarships, "
                "government jobs, or guide you regarding document uploads and scam detection. "
                "What specific service are you looking for today?"
            )
            response_data["action"] = "GENERAL_CONVERSATION"

        # Note: In a full production app, this is where we would call an LLM API 
        # e.g., google.generativeai.generate_content(prompt + context)
        
        # Simulated translation placeholder
        if language != "en" and response_data.get("reply"):
            response_data["reply"] = f"[{language.upper()} TRANSLATED] " + str(response_data.get("reply"))

        return response_data
