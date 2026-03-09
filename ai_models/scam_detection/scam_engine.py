import re

class ScamDetectionEngine:
    """
    AI heuristic model for Scam and Fraud Detection.
    Analyzes Links and Messages to protect citizens from Phishing, 
    Fake Job Offers, and Fake Schemes.
    """
    def __init__(self):
        # Suspicious keywords commonly used in Indian government scams
        self.scam_keywords = [
            'lottery', 'winner', 'crore', 'urgent action', 'kyc update immediately',
            'block your account', 'claim your prize', 'customs fee', 'pay processing fee',
            'free laptops', 'pm scheme free mobile'
        ]
        
        # Suspicious domains / URL patterns (not .gov.in / .nic.in)
        self.suspicious_tlds = ['.xyz', '.click', '.tk', '.free', '.top', 'bit.ly', 'tinyurl']

    def analyze_content(self, text: str, links: list = None) -> dict:
        """
        Analyzes a given text payload and optional links.
        Returns: safe, suspicious, or scam with an explanation.
        """
        text_lower = text.lower()
        score = 0
        reasons = []

        # 1. Keyword Analysis
        for kw in self.scam_keywords:
            if kw in text_lower:
                score += 3
                reasons.append(f"Scam keyword detected: '{kw}'")

        # 2. Financial Urgency NLP heuristic
        if re.search(r'(pay|send|transfer).*(fee|tax|charge).*(immediate|urgent)', text_lower):
            score += 5
            reasons.append("High urgency financial demand found.")

        # 3. Contact mechanism heuristic
        if re.search(r'call now|whatsapp immediately|scan qr', text_lower):
            score += 2
            reasons.append("Suspicious call-to-action requested.")

        # 4. Link Analysis
        if links:
            for link in links:
                if 'gov.in' in link or 'nic.in' in link:
                    score -= 5 # Official domains reduce risk significantly
                    reasons.append(f"Official Government Domain detected: {link}")
                else:
                    for tld in self.suspicious_tlds:
                        if tld in link:
                            score += 4
                            reasons.append(f"Suspicious URL shortener or TLD found: {link}")
        
        # Determine Status
        if score >= 6:
            status = "SCAM"
            color = "red"
        elif score >= 3:
            status = "SUSPICIOUS"
            color = "orange"
        else:
            status = "SAFE"
            color = "green"

        return {
            "status": status,
            "risk_score": score,
            "color": color,
            "reasons": reasons,
            "verdict": f"The AI has classified this content as {status}."
        }
