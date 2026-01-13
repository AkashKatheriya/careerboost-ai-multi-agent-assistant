from utils.gemini_client import GeminiClient
import json

class JobMatcher:
    def __init__(self):
        self.client = GeminiClient()

    def match(self, profile_path: str, job_titles: list) -> str:
        try:
            with open(profile_path, 'r') as f:
                profile_data = json.load(f)
        except Exception as e:
            return f"Error reading profile: {str(e)}"

        prompt = f"""
        Analyze the following candidate profile and match it against the provided job titles.

        Profile:
        {json.dumps(profile_data, indent=2)}

        Job Titles:
        {', '.join(job_titles)}

        For each job title, provide:
        1. Match Percentage
        2. Key Strength matches
        3. Missing Skills/Gaps
        4. Recommendation (Apply/Upskill)
        """

        return self.client.generate_content(prompt)
