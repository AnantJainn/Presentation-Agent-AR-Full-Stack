# # agents/narrative_agent.py
# from llm import call_llm
# from utils.json_utils import extract_json

# def narrative_agent(state):
#     tex_content = state.get("tex_content", "")
#     audience = state.get("audience", "General Audience")

#     # Truncate if too huge
#     if len(tex_content) > 20000:
#         tex_content = tex_content[:20000] + "... [Truncated]"

#     prompt = f"""
# You are an expert Research Assistant transforming a Paper into a Presentation.

# INPUT CONTEXT (LaTeX Source):
# \"\"\"
# {tex_content}
# \"\"\"

# TASK:
# 1. Analyze the structure (Title, Authors, Abstract, Sections, Working Mechanism, Related Work).
# 2. Create a presentation structure (8-10 slides) that should very detail and cover all main things.
# 3. **CRITICAL:** The 'content' and 'key_points' must be **PLAIN ENGLISH**. 
#    - DO NOT write LaTeX code (e.g. do NOT write \\frac{{a}}{{b}}, write 'a divided by b').
#    - DO NOT use backslashes.

# Return ONLY valid JSON. No Markdown.

# Schema:
# {{
#   "title": "Paper Title",
#   "slides": [
#     {{
#       "title": "Slide Title",
#       "content": "Summary paragraph in plain text.",
#       "key_points": ["Point 1", "Point 2"],
#       "visual_description": "Description of a diagram or image for this section."
#     }}
#   ]
# }}
# """

#     content = call_llm(prompt)
#     state["presentation"] = extract_json(content)
#     return state




# agents/narrative_agent.py
import json
from backend.llm import call_llm
from utils.json_utils import extract_json

def narrative_agent(state):
    print("✍️  Narrative Agent Working...")
    tex_content = state.get("tex_content", "")
    current_presentation = state.get("presentation", None)
    critique = state.get("critique", "")
    feedback = state.get("user_feedback", "")
    iteration = state.get("iteration", 0)

    # MODE 1: Refinement (based on internal critique or user feedback)
    if current_presentation and (critique or feedback):
        print(f"   🔄 Refining content (Iter {iteration})...")
        prompt = f"""
        You are an expert Presentation Editor.
        
        CURRENT PRESENTATION JSON:
        {json.dumps(current_presentation, indent=2)}

        FEEDBACK TO ADDRESS:
        Internal Critique: {critique}
        User Feedback: {feedback}

        TASK:
        Modify the JSON to address the feedback. 
        - If told to be detailed, expand content.
        - If told to be concise, shorten bullets.
        - Fix any structural issues mentioned.
        - Keep the same JSON structure.

        Return ONLY the valid JSON.
        """
    
    # MODE 2: Initial Generation
    else:
        # Truncate if too huge
        if len(tex_content) > 25000:
            tex_content = tex_content[:25000] + "... [Truncated]"
            
        prompt = f"""
        You are an expert Research Assistant transforming a Paper into a Presentation.

        INPUT CONTEXT (LaTeX Source):
        \"\"\"
        {tex_content}
        \"\"\"

        TASK:
        1. Analyze the structure (Title, Authors, Abstract, Sections, Working Mechanism, Related Work).
        2. Create a presentation structure (8-10 slides) that should very detail and cover all main things including main formulae and equations.
        3. **CRITICAL:** The 'content' and 'key_points' must be **PLAIN ENGLISH**. 
            - DO NOT write LaTeX code (e.g. do NOT write \\frac{{a}}{{b}}, write 'a divided by b').
            - DO NOT use backslashes.

        Return ONLY valid JSON.

        Schema:
        {{
          "title": "Paper Title",
          "slides": [
            {{
              "title": "Slide Title",
              "content": "Summary paragraph in plain text.",
              "key_points": ["Point 1", "Point 2"],
              "visual_description": "Description of image"
            }}
          ]
        }}
        """

    response = call_llm(prompt, system_message="You are a JSON-speaking presentation architect.")
    
    try:
        new_presentation = extract_json(response)
        state["presentation"] = new_presentation
        # Clear used feedback to prevent loop lock
        state["critique"] = "" 
    except Exception as e:
        print(f"   ⚠️ JSON Error: {e}")
        
    return state