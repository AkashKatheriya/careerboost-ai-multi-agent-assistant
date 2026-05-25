from google import genai
from config import settings

class GeminiClient:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = settings.MODEL_NAME
        self.default_config = {
            "temperature": settings.TEMPERATURE,
            "max_output_tokens": settings.MAX_TOKENS,
        }

    def _get_client(self, request_api_key: str = None) -> genai.Client:
        key = request_api_key or self.api_key
        if not key:
            raise ValueError("Gemini API Key is missing. Please set it in Settings or your environment.")
        return genai.Client(api_key=key)

    def generate_content(self, prompt: str, system_instruction: str = None, request_api_key: str = None, json_mode: bool = False) -> str:
        try:
            client = self._get_client(request_api_key)
            config = self.default_config.copy()
            if system_instruction:
                config["system_instruction"] = system_instruction
            if json_mode:
                config["response_mime_type"] = "application/json"

            response = client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=config
            )
            return response.text
        except Exception as e:
            return f"Error generating content: {str(e)}"

