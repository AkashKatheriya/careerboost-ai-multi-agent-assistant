from utils.gemini_client import GeminiClient
from utils.pdf_parser import extract_text_from_pdf

class ResumeOptimizer:
    def __init__(self):
        self.client = GeminiClient()

    def optimize(self, file_path: str, target_job: str = None) -> str:
        resume_text = extract_text_from_pdf(file_path)
        if resume_text.startswith("Error"):
            return resume_text

        prompt = f"""
        Analyze the following resume and provide optimization suggestions.
        Resume Text:
        {resume_text}
        """

        if target_job:
            prompt += f"\nTarget Job: {target_job}\n"
            prompt += "Focus on tailoring the resume for this specific job role, highlighting relevant skills and keywords."
        else:
            prompt += "Focus on general best practices, ATS compatibility, and clarity."

        return self.client.generate_content(prompt)
