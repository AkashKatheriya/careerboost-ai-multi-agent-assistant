from utils.gemini_client import GeminiClient
from config import prompts
import json

class JobMatcher:
    def __init__(self, api_key: str = None):
        self.client = GeminiClient(api_key=api_key)

    def match(self, profile_path_or_dict: any, job_titles: list, api_key: str = None) -> str:
        if isinstance(profile_path_or_dict, dict):
            profile_data = profile_path_or_dict
        else:
            try:
                with open(profile_path_or_dict, 'r') as f:
                    profile_data = json.load(f)
            except Exception as e:
                return json.dumps({"error": f"Error reading profile file: {str(e)}"})

        job_titles_list = ", ".join(job_titles) if isinstance(job_titles, list) else job_titles

        prompt = prompts.JOB_MATCHER_PROMPT.format(
            job_titles_list=job_titles_list,
            profile_json=json.dumps(profile_data, indent=2)
        )

        return self.client.generate_content(
            prompt=prompt,
            system_instruction=prompts.JOB_MATCHER_SYSTEM,
            request_api_key=api_key,
            json_mode=True
        )

