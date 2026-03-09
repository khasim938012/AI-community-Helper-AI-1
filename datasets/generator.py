import json
import random
import os

# --- Configurations ---

DATASETS_DIR = "."

def generate_schemes(count=150):
    departments = ["Ministry of Agriculture", "Ministry of Health", "Ministry of Social Justice", "Ministry of Women & Child Development", "Ministry of Rural Development", "Ministry of Education", "State Govt", "Ministry of Minority Affairs"]
    benefits_type = ["Financial Assistance", "Health Insurance", "Subsidized Loan", "Direct Benefit Transfer", "Pension", "Housing Subsidy", "Equipment Grant"]
    audiences = ["Farmers", "Women", "Senior Citizens", "Students", "Entrepreneurs", "BPL Families", "Disabled", "General"]
    status_list = ["Active", "Open Space", "Closed"]

    prefix = ["Pradhan Mantri", "Mukhyamantri", "State", "National", "Gruha", "Stand-Up", "Start-Up", "Kisan", "Deen Dayal", "Swachh"]
    suffix = ["Yojana", "Scheme", "Mission", "Program", "Abhiyan", "Nidhi", "Samman", "Vikas"]

    schemes = []
    for i in range(1, count + 1):
        name = f"{random.choice(prefix)} {random.choice(['Suraksha', 'Krishi', 'Awas', 'Swasthya', 'Gramin', 'Kalyan', 'Shiksha'])} {random.choice(suffix)}"
        
        # Ensure we don't have exactly the same name generated repeatedly, though randomness usually handles it
        if i % 10 == 0:
             name = f"{name} {2020 + (i % 5)}"

        scheme = {
            "id": f"SCHEME-{i:04d}",
            "title": name,
            "department": random.choice(departments),
            "benefit_type": random.choice(benefits_type),
            "target_audience": random.choice(audiences),
            "description": f"This scheme aims to provide {random.choice(['better livelihood', 'financial stability', 'healthcare coverage', 'educational support'])} to {random.choice(['marginalized communities', 'deserving individuals', 'rural areas'])} through direct intervention.",
            "eligibility_criteria": [
                f"Applicant must be a citizen of India.",
                f"Age limit: {random.randint(18, 25)} to {random.randint(45, 60)} years.",
                f"Valid Aadhaar Card is required."
            ],
            "documents_required": random.sample(["Aadhaar Card", "PAN Card", "Income Certificate", "Caste Certificate", "Bank Passbook", "Passport Size Photo", "Domicile Certificate"], random.randint(3, 5)),
            "application_status": random.choice(status_list)
        }
        schemes.append(scheme)
    return schemes

def generate_scholarships(count=100):
    providers = ["AICTE", "UGC", "Ministry of Minority Affairs", "Department of Higher Education", "State Education Board", "Private Trust"]
    levels = ["School (Class 1-10)", "Pre-Matric", "Post-Matric", "Undergraduate", "Postgraduate", "PhD / Research"]

    names_start = ["National", "Post-Matric", "Pre-Matric", "Merit-cum-Means", "Central Sector", "Pragati", "Saksham", "E-Kalyan", "Swami Vivekananda"]
    names_end = ["Scholarship", "Fellowship", "Grant", "Assistance Scheme"]

    scholarships = []
    for i in range(1, count + 1):
        scholarships.append({
            "id": f"SCHOLAR-{i:04d}",
            "title": f"{random.choice(names_start)} {random.choice(names_end)} {2025}",
            "provider": random.choice(providers),
            "education_level": random.choice(levels),
            "amount": f"₹{random.choice([5000, 10000, 25000, 50000, 100000])} per annum",
            "last_date": f"2026-{random.randint(4, 12):02d}-30",
            "description": "Financial assistance to meritorious and deserving students.",
            "eligibility": [
                f"Minimum {random.choice([50, 60, 75])}% marks in previous examination.",
                f"Annual family income must be less than ₹{random.choice([2, 5, 8])} Lakhs."
            ],
            "documents_required": ["Aadhaar", "Marksheet", "Income Certificate", "Bank Details"]
        })
    return scholarships

def generate_jobs(count=100):
    organizations = ["SSC", "UPSC", "Indian Railways (RRB)", "Indian Army", "Indian Navy", "State Police", "Staff Selection Board", "Public Sector Bank (IBPS)"]
    roles = ["Clerk", "Constable", "Officer Grade B", "Assistant Loco Pilot", "Technician", "Inspector", "Medical Officer", "Engineer", "Data Entry Operator"]
    qualifications = ["10th Pass", "12th Pass", "Any Graduate", "B.Tech/B.E.", "Diploma", "Postgraduate", "MBBS"]

    jobs = []
    for i in range(1, count + 1):
        jobs.append({
            "id": f"JOB-{i:04d}",
            "title": f"{random.choice(organizations)} Recruitment for {random.choice(roles)}",
            "organization": random.choice(organizations),
            "role": random.choice(roles),
            "vacancies": random.randint(10, 5000),
            "qualification": random.choice(qualifications),
            "salary": f"₹{random.randint(20, 50)},000 - ₹{random.randint(60, 150)},000 / month",
            "last_date": f"2026-{random.randint(4, 12):02d}-15",
            "application_fee": f"₹{random.choice([0, 100, 250, 500])}",
            "documents_required": ["Identity Proof", "Educational Certificates", "Photograph", "Signature", "Category Certificate (if applicable)"]
        })
    return jobs

if __name__ == "__main__":
    os.makedirs(os.path.join(DATASETS_DIR, "government_schemes"), exist_ok=True)
    os.makedirs(os.path.join(DATASETS_DIR, "scholarships"), exist_ok=True)
    os.makedirs(os.path.join(DATASETS_DIR, "government_jobs"), exist_ok=True)

    print("Generating 150+ Govt Schemes...")
    with open(os.path.join(DATASETS_DIR, "government_schemes", "schemes.json"), "w", encoding="utf-8") as f:
        json.dump(generate_schemes(155), f, indent=4)

    print("Generating 100+ Scholarships...")
    with open(os.path.join(DATASETS_DIR, "scholarships", "scholarships.json"), "w", encoding="utf-8") as f:
        json.dump(generate_scholarships(120), f, indent=4)

    print("Generating 100+ Govt Jobs...")
    with open(os.path.join(DATASETS_DIR, "government_jobs", "jobs.json"), "w", encoding="utf-8") as f:
        json.dump(generate_jobs(115), f, indent=4)

    print("Generation Complete: datasets created.")
