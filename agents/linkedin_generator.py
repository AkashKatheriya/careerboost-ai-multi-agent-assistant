from utils.gemini_client import GeminiClient

class LinkedInGenerator:
    def __init__(self):
        self.client = GeminiClient()

    def generate(self, topic: str, style: str = "Professional") -> str:
        prompt = f"""
        Generate a LinkedIn post about "{topic}".
        Style: {style}

        Include:
        - Engaging hook
        - Main content (value driven)
        - Call to Action
        - Relevant Hashtags
        """

        return self.client.generate_content(prompt)
