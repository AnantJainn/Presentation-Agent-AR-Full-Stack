# agents/critique_agent.py
from llm import call_llm

def critique_agent(state):
    print("🧐 Critique Agent Analyzing...")
    presentation = state.get("presentation")
    
    # We critique the JSON structure directly as it's the source of truth
    prompt = f"""
    You are a strict Presentation Quality Control Agent.
    
    Review this proposed presentation structure:
    {presentation}

    Check for:
    1. **Flow:** Does the narrative make sense?
    2. **Clarity:** Are bullet points too long?
    3. **Completeness:** Did we miss the "Results" or "Methodology"?
    4. **Formatting:** Is there hidden LaTeX code in the text? (Bad!)

    Output a concise paragraph of critique focusing on what to FIX. 
    If it is perfect, output "LOOKS GOOD".
    """

    critique = call_llm(prompt)
    print(f"   📝 Critique: {critique[:100]}...")
    
    state["critique"] = critique
    state["iteration"] = state.get("iteration", 0) + 1
    return state