from google import genai
from config import settings

class GeminiClient:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = settings.MODEL_NAME
        self.config = {
            "temperature": settings.TEMPERATURE,
            "max_output_tokens": settings.MAX_TOKENS,
        }

    def generate_content(self, prompt: str) -> str:
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=self.config
            )
            return response.text
        except Exception as e:
            return f"Error generating content: {str(e)}"
