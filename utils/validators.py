import json

def validate_profile_json(profile_str: str) -> bool:
    """Validates if the provided string is a valid JSON dictionary."""
    try:
        data = json.loads(profile_str)
        return isinstance(data, dict)
    except:
        return False

def validate_profile_dict(profile_data: dict) -> bool:
    """Validates if the profile dictionary contains basic expected keys."""
    if not isinstance(profile_data, dict):
        return False
    # Check if there is at least some core identifying details (like skills or name)
    return "skills" in profile_data or "experience" in profile_data or "name" in profile_data
