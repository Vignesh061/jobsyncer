import os
import fitz
import numpy as np
from flask import Flask, request, render_template, jsonify
from werkzeug.utils import secure_filename
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import re
import time
from datetime import datetime

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

model = SentenceTransformer("all-MiniLM-L6-v2")

def extract_text_from_pdf(pdf_path):
    try:
        text = ""
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text()
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        return ""

def compute_similarity(resume_text, job_desc):
    try:
        embeddings = model.encode([resume_text, job_desc])
        similarity = cosine_similarity([embeddings[0]], [embeddings[1]])
        return round(similarity[0][0] * 100, 2)
    except Exception as e:
        print(f"Error computing similarity: {str(e)}")
        return 0.0

def extract_keywords_from_job(job_desc):
    # This is a simplified keyword extraction
    # In a real application, you'd use NLP techniques
    common_job_keywords = [
        "team", "develop", "manage", "lead", "project", "collaborate", 
        "analyze", "implement", "communication", "problem-solving", 
        "innovation", "customer", "solution", "strategy", "agile",
        "javascript", "python", "java", "c++", "react", "node", "database",
        "cloud", "aws", "azure", "leadership", "design", "ux"
    ]
    
    # Find keywords that appear in the job description
    found_keywords = [kw for kw in common_job_keywords if kw.lower() in job_desc.lower()]
    return found_keywords

def check_ats_friendly(resume_text, job_desc):
    issues = []
    
    # Check for complex formatting elements
    if re.search(r'\.(png|jpg|jpeg|gif)', resume_text, re.IGNORECASE):
        issues.append("Avoid using images or graphics in your resume.")
    
    # Check for common section headers
    expected_sections = ["education", "experience", "skills", "projects", "contact"]
    missing_sections = [section for section in expected_sections if section.lower() not in resume_text.lower()]
    if missing_sections:
        issues.append(f"Missing important sections: {', '.join(missing_sections)}. Add clear section headers.")
    
    # Check for readable fonts (Assume text-only PDF passes this)
    if not resume_text:
        issues.append("Resume text could not be extracted. Ensure your resume uses standard fonts.")
    
    # Check for keyword usage from job description
    job_keywords = extract_keywords_from_job(job_desc)
    matched_keywords = [kw for kw in job_keywords if kw.lower() in resume_text.lower()]
    missing_keywords = [kw for kw in job_keywords if kw.lower() not in resume_text.lower()]
    
    if len(matched_keywords) < len(job_keywords) * 0.5:
        issues.append("Your resume doesn't include enough keywords from the job description.")
    
    # Check resume length by word count
    word_count = len(resume_text.split())
    if word_count < 300:
        issues.append("Your resume seems too short. Aim for 400-800 words for optimal ATS parsing.")
    elif word_count > 1200:
        issues.append("Your resume is very long. Consider condensing to 1-2 pages for better ATS results.")
    
    return {
        "issues": issues if issues else ["Your resume appears to be ATS friendly!"],
        "missing_keywords": missing_keywords
    }

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        if "resume" not in request.files:
            return render_template("index.html", error="No file uploaded"), 400
        
        file = request.files["resume"]
        job_desc = request.form["job_desc"]
        
        if file.filename == "" or job_desc.strip() == "":
            return render_template("index.html", error="Please provide both a resume file and job description"), 400
        
        # Check if the file is a PDF
        if not file.filename.lower().endswith('.pdf'):
            return render_template("index.html", error="Only PDF files are accepted"), 400
            
        # Create a unique filename to avoid conflicts
        unique_filename = f"{int(time.time())}_{secure_filename(file.filename)}"
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
        file.save(filepath)
        
        try:
            resume_text = extract_text_from_pdf(filepath)
            if not resume_text.strip():
                return render_template("index.html", error="Could not extract text from the PDF. Make sure it contains text content."), 400
                
            score = compute_similarity(resume_text, job_desc)
            ats_result = check_ats_friendly(resume_text, job_desc)
            ats_issues = ats_result["issues"]
            missing_keywords = ats_result["missing_keywords"]
            
            # Clean up the uploaded file after processing
            try:
                os.remove(filepath)
            except:
                pass  # Ignore errors in cleanup
                
            return render_template(
                "index.html", 
                score=score, 
                ats_issues=ats_issues,
                missing_keywords=missing_keywords,
                job_description=job_desc,
                analysis_date=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            )
            
        except Exception as e:
            # Clean up file in case of error
            try:
                os.remove(filepath)
            except:
                pass
                
            return render_template("index.html", error=f"Error processing file: {str(e)}"), 500
    
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)