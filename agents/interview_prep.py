from utils.gemini_client import GeminiClient

class InterviewPrep:
    def __init__(self):
        self.client = GeminiClient()

    def prepare(self, job_title: str, company: str = None) -> str:
        prompt = f"Generate interview preparation material for the role of {job_title}"
        if company:
            prompt += f" at {company}"

        prompt += """
        . Include:
        1. 5 Technical Questions with Model Answers
        2. 3 Behavioral Questions (STAR method)
        3. Key topics to study
        4. specific company culture tips if available.
        """

        return self.client.generate_content(prompt)
