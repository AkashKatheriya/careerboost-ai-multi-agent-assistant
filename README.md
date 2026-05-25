# 🤖 CareerBoost AI Multi-Agent Assistant

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/AkashKatheriya/careerboost-ai-multi-agent-assistant)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**CareerBoost AI** is an intelligent, multi-agent career assistant powered by **Google Gemini 2.5 Flash** (via the official `google-genai` SDK). It provides a visually stunning, glassmorphic Single Page Application (SPA) dashboard helping job seekers optimize resumes, match candidate profiles to roles, prepare for interviews with an interactive mock recruiter chat, and generate engaging LinkedIn content.


Designed specifically to be **open-source friendly and safe to host**, visitors can supply their own Gemini API key inside the UI settings (saved only in their local browser storage and transmitted via request headers).

---

## ✨ Key Features

1. **Resume Optimizer (ATS Auditor)**
   - Drag and drop PDF resume parsing.
   - Comprehensive ATS scoring (0-100) and strengths audit.
   - Target job keyword comparison (missing keywords extraction).
   - Re-written high-impact bullet points using the **Google X-Y-Z formula** (*"Accomplished [X], as measured by [Y], by doing [Z]"*).

2. **Job Matcher**
   - Form-based candidate profiling (skills, experience, projects).
   - Match percentage and strength overlap.
   - Core skill gap identification.
   - Personalized upskilling roadmaps and learning paths.

3. **Interview Preparation**
   - Company-specific preparation guides.
   - 5 customized technical questions with model answers.
   - 3 behavioral questions outline using the STAR method.

4. **Mock Interview Simulator**
   - Interactive, turn-by-turn chat with an AI technical recruiter.
   - Evaluation of each response with real-time feedback before asking the next question.
   - Mimics realistic interview pacing.

5. **LinkedIn Content Generator**
   - AI draft generator with professional, thought leadership, casual, and storytelling styles.
   - Hooks, formatting, hashtags, and call-to-actions optimized for engagement.
   - One-click copy-to-clipboard functionality.

---

## 🔒 Open Source Security Architecture

When hosting applications publicly, hardcoding or exposing server API keys is a major vulnerability. CareerBoost solves this with a **Dual-Mode API Key resolution**:
- **Local Settings**: If run locally, it reads the `GEMINI_API_KEY` from your local `.env` file.
- **Client Override**: Users can paste their personal key inside the **Settings** tab. The key is stored in the browser's `localStorage` and sent with each request in the `X-Gemini-API-Key` header.
- **Git Protection**: The `.env` file is excluded from Git tracking in `.gitignore`.

---

## 📁 Project Structure

```
careerboost-ai-multi-agent-assistant/
├── agents/
│   ├── interview_prep.py     # Guide builder & mock chat simulator agent
│   ├── job_matcher.py        # Skill overlap and gap analyser agent
│   ├── linkedin_generator.py # LinkedIn content drafter agent
│   └── resume_optimizer.py   # PDF text extraction & ATS scorer agent
├── config/
│   ├── prompts.py            # Centralized system instructions & templates
│   └── settings.py           # Application configurations (Model, Temperature)
├── static/
│   ├── index.html            # Stunning Single Page Application dashboard UI
│   ├── styles.css            # Dark slate glassmorphism styles and animations
│   └── app.js                # Frontend API state manager and chat router
├── utils/
│   ├── gemini_client.py      # Core Google GenAI wrapper supporting dynamic keys
│   ├── pdf_parser.py         # PyPDF text extraction helper
│   └── validators.py         # Payload validators
├── .env.example              # Example environment configuration
├── app.py                    # FastAPI server entrypoint
├── requirements.txt          # Python dependencies
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start (Local Run)

### 1. Prerequisites
- Python 3.10 or higher
- Google Gemini API Key ([Get one free from Google AI Studio](https://aistudio.google.com/))

### 2. Setup & Installation
```bash
# Clone the repository
git clone https://github.com/AkashKatheriya/careerboost-ai-multi-agent-assistant.git
cd careerboost-ai-multi-agent-assistant

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure local key (Optional)
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_actual_api_key_here
```
*(If left empty, the application will boot successfully, and you can paste your key in the settings tab of the web page).*

### 4. Run the Server
```bash
python -m uvicorn app:app --reload --port 8000
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser!

---

## 🌐 Production Deployment Guide

You can host CareerBoost on any Python-capable host. Here are two easy options:

### Option A: Hosting on Render (Free Tier)
1. Commit and push your code to your GitHub repository.
2. Log in to [Render](https://render.com/) and click **New > Web Service**.
3. Link your GitHub repository.
4. Set the configurations:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Click **Deploy Web Service**. Render will spin up the server and give you a public URL.

### Option B: Hosting on Hugging Face Spaces (100% Free)
1. Create a new Space on [Hugging Face](https://huggingface.co/spaces).
2. Choose **Docker** as the SDK (select **Blank** template).
3. Create a `Dockerfile` in the root of your project:
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /code
   COPY ./requirements.txt /code/requirements.txt
   RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
   COPY . .
   CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
   ```
4. Push your code to the Hugging Face Space git repository. Hugging Face will build the Docker container and host it automatically.

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Made with ❤️ by Akash Katheriya**
