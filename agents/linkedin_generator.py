from utils.gemini_client import GeminiClient
from config import prompts

class LinkedInGenerator:
    def __init__(self, api_key: str = None):
        self.client = GeminiClient(api_key=api_key)

    def generate(self, topic: str, style: str = "Professional", api_key: str = None) -> str:
        prompt = prompts.LINKEDIN_GENERATOR_PROMPT.format(
            topic=topic,
            style=style
        )

        return self.client.generate_content(
            prompt=prompt,
            system_instruction=prompts.LINKEDIN_GENERATOR_SYSTEM,
            request_api_key=api_key
        )

