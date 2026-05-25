from utils.gemini_client import GeminiClient
from utils.pdf_parser import extract_text_from_pdf
from config import prompts

class ResumeOptimizer:
    def __init__(self, api_key: str = None):
        self.client = GeminiClient(api_key=api_key)

    def optimize(self, file_path_or_text: str, target_job: str = None, api_key: str = None) -> str:
        if file_path_or_text.lower().endswith(".pdf"):
            resume_text = extract_text_from_pdf(file_path_or_text)
        else:
            resume_text = file_path_or_text

        if not resume_text or resume_text.startswith("Error"):
            return resume_text or "Error: Empty resume content"

        target_job_text = f"Target Job Role: {target_job}" if target_job else "Target Job Role: General Career Optimization (No specific target role specified)"

        prompt = prompts.RESUME_OPTIMIZER_PROMPT.format(
            target_job_text=target_job_text,
            resume_text=resume_text
        )

        return self.client.generate_content(
            prompt=prompt,
            system_instruction=prompts.RESUME_OPTIMIZER_SYSTEM,
            request_api_key=api_key,
            json_mode=True
        )

