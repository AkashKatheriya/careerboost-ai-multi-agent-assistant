from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import os
import shutil
import json

from agents.resume_optimizer import ResumeOptimizer
from agents.job_matcher import JobMatcher
from agents.interview_prep import InterviewPrep
from agents.linkedin_generator import LinkedInGenerator
from utils.validators import extract_json_string

app = FastAPI(
    title="CareerBoost AI Multi-Agent Assistant",
    description="FastAPI Backend for CareerBoost AI multi-agent platform"
)

# Ensure static directories exist
os.makedirs("static", exist_ok=True)
os.makedirs("temp_uploads", exist_ok=True)

# Serve the single-page application at the root
@app.get("/")
async def get_index():
    index_path = "static/index.html"
    if not os.path.exists(index_path):
        return {"message": "CareerBoost API is running. Web UI files are being created."}
    return FileResponse(index_path)

# Resume Optimizer Endpoint (takes file upload or raw text)
@app.post("/api/resume/optimize")
async def optimize_resume(
    file: UploadFile = File(None),
    resume_text: str = Form(None),
    target_job: str = Form(None),
    x_gemini_api_key: str = Header(None)
):
    # Parse resume from file upload or raw text form field
    if file:
        temp_path = os.path.join("temp_uploads", file.filename)
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        optimizer = ResumeOptimizer()
        try:
            result = optimizer.optimize(temp_path, target_job, x_gemini_api_key)
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    elif resume_text:
        optimizer = ResumeOptimizer()
        result = optimizer.optimize(resume_text, target_job, x_gemini_api_key)
    else:
        raise HTTPException(status_code=400, detail="Either a resume PDF file or raw resume text must be provided.")
        
    cleaned_result = extract_json_string(result)
    try:
        # Try parsing response since we requested json_mode from the agent
        return json.loads(cleaned_result)
    except Exception:
        # Fallback to returning raw response string
        return {"raw_response": result}

# Job Matcher Endpoint
@app.post("/api/match/jobs")
async def match_jobs(
    profile_data: str = Form(...),
    job_titles: str = Form(...),
    x_gemini_api_key: str = Header(None)
):
    try:
        profile_dict = json.loads(profile_data)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid profile JSON format.")
        
    try:
        titles_list = json.loads(job_titles)
        if not isinstance(titles_list, list):
            titles_list = [str(titles_list)]
    except Exception:
        # Fallback to parsing comma-separated list
        titles_list = [t.strip() for t in job_titles.split(",") if t.strip()]

    if not titles_list:
        raise HTTPException(status_code=400, detail="At least one target job title is required.")

    matcher = JobMatcher()
    result = matcher.match(profile_dict, titles_list, x_gemini_api_key)
    
    cleaned_result = extract_json_string(result)
    try:
        return json.loads(cleaned_result)
    except Exception:
        return {"raw_response": result}

# Interview Preparation Sheet Endpoint
@app.post("/api/interview/prep")
async def interview_prep(
    job_title: str = Form(...),
    company: str = Form(None),
    x_gemini_api_key: str = Header(None)
):
    prep = InterviewPrep()
    result = prep.prepare(job_title, company, x_gemini_api_key)
    return {"markdown": result}

# Interactive Mock Interview Chatbot Endpoint
@app.post("/api/interview/chat")
async def interview_chat(
    job_title: str = Form(...),
    company: str = Form(None),
    messages: str = Form(...),
    x_gemini_api_key: str = Header(None)
):
    try:
        messages_list = json.loads(messages)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid messages list JSON format.")
        
    prep = InterviewPrep()
    result = prep.chat(job_title, company, messages_list, x_gemini_api_key)
    return {"message": result}

# LinkedIn Content Generator Endpoint
@app.post("/api/linkedin/generate")
async def linkedin_generate(
    topic: str = Form(...),
    style: str = Form("Professional"),
    x_gemini_api_key: str = Header(None)
):
    generator = LinkedInGenerator()
    result = generator.generate(topic, style, x_gemini_api_key)
    return {"markdown": result}

# Mount static folder for CSS and JS assets
app.mount("/static", StaticFiles(directory="static"), name="static")
