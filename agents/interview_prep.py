from utils.gemini_client import GeminiClient
from config import prompts

class InterviewPrep:
    def __init__(self, api_key: str = None):
        self.client = GeminiClient(api_key=api_key)

    def prepare(self, job_title: str, company: str = None, api_key: str = None) -> str:
        company_text = f"at {company}" if company else ""
        prompt = prompts.INTERVIEW_PREP_PROMPT.format(
            job_title=job_title,
            company_text=company_text
        )

        return self.client.generate_content(
            prompt=prompt,
            system_instruction=prompts.INTERVIEW_PREP_SYSTEM,
            request_api_key=api_key
        )

    def chat(self, job_title: str, company: str = None, messages: list = None, api_key: str = None) -> str:
        if messages is None:
            messages = []
            
        company_text = f"at {company}" if company else ""
        system_instruction = prompts.MOCK_INTERVIEW_SYSTEM.format(
            job_title=job_title,
            company_text=company_text
        )

        history_text = ""
        for msg in messages:
            role = "Candidate" if msg.get("role") == "user" else "Interviewer"
            history_text += f"{role}: {msg.get('content')}\n"

        prompt = "You are in the middle of conducting the mock interview. Here is the conversation history:\n"
        prompt += history_text
        if not messages:
            prompt += "\nPlease start the interview by greeting the candidate and asking the first question."
        else:
            prompt += "\nEvaluate the candidate's last answer, provide brief constructive feedback, and then ask the next question."

        return self.client.generate_content(
            prompt=prompt,
            system_instruction=system_instruction,
            request_api_key=api_key
        )

