# utils/json_utils.py
import json
import re

def extract_json(text: str):
    """
    Extracts JSON from LLM output with robust error handling for LaTeX backslashes.
    """
    if not text or not text.strip():
        raise ValueError("LLM returned empty output")

    # 1. Find the JSON block
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError(f"No JSON found in LLM output:\n{text}")

    json_str = match.group()

    # 2. Try parsing standard JSON
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        pass # Fall through to repair attempts

    # 3. Repair Attempt: Escape backslashes for LaTeX content
    # This regex looks for backslashes that are NOT followed by specific JSON control chars
    # We replace single \ with double \\
    try:
        # Simple heuristic: Replace \ with \\ but protect newline \n and quote \"
        # Step A: Mask valid escapes
        masked = json_str.replace('\\"', '___QUOTE___').replace('\\n', '___NEWLINE___')
        # Step B: Escape remaining backslashes (which are likely LaTeX commands)
        masked = masked.replace('\\', '\\\\')
        # Step C: Unmask
        repaired = masked.replace('___QUOTE___', '\\"').replace('___NEWLINE___', '\\n')
        
        return json.loads(repaired)
    except Exception as e:
        # If all else fails, raise the original error for debugging
        raise ValueError(f"Failed to parse JSON even after repair.\nError: {e}\nContent:\n{json_str}")