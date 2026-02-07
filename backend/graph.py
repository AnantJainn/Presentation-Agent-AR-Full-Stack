# # graph.py
# from langgraph.graph import StateGraph, END
# from agents.narrative_agent import narrative_agent
# from agents.pptx_agent import pptx_agent
# from agents.beamer_agent import beamer_agent

# def route_output_format(state):
#     # Return the name of the node to visit next
#     if state.get("output_format") == "beamer":
#         return "beamer"
#     else:
#         return "pptx"

# builder = StateGraph(dict)

# builder.add_node("narrative", narrative_agent)
# builder.add_node("pptx", pptx_agent)
# builder.add_node("beamer", beamer_agent)

# builder.set_entry_point("narrative")

# # CONDITIONAL EDGE: Narrative -> (PPTX or Beamer)
# builder.add_conditional_edges(
#     "narrative",
#     route_output_format,
#     {
#         "pptx": "pptx",
#         "beamer": "beamer"
#     }
# )

# builder.add_edge("pptx", END)
# builder.add_edge("beamer", END)

# graph = builder.compile()





# graph.py
from langgraph.graph import StateGraph, END
from agents.narrative_agent import narrative_agent
from agents.beamer_agent import beamer_agent
from agents.critique_agent import critique_agent
from agents.pptx_agent import pptx_agent

# Define the State
class AgentState(dict):
    tex_content: str
    presentation: dict
    output_format: str
    critique: str
    user_feedback: str
    iteration: int
    final_latex: str

def route_critique(state):
    # If we have reached 3 iterations, or if critique says "LOOKS GOOD", we stop.
    if state["iteration"] >= 3 or "LOOKS GOOD" in state["critique"].upper():
        return "finalize"
    return "refine"

def route_format(state):
    if state.get("output_format") == "beamer":
        return "beamer"
    return "pptx"

builder = StateGraph(AgentState)

# Nodes
builder.add_node("narrative", narrative_agent)
builder.add_node("beamer", beamer_agent)
builder.add_node("pptx", pptx_agent)
builder.add_node("critique", critique_agent)

# Edges
builder.set_entry_point("narrative")

# 1. Narrative -> Format Generator
builder.add_conditional_edges(
    "narrative",
    route_format,
    {
        "beamer": "beamer",
        "pptx": "pptx"
    }
)

# 2. Format Generator -> Critique
# (We critique after generation to ensure the flow is solid)
builder.add_edge("beamer", "critique")
builder.add_edge("pptx", "critique")

# 3. Critique -> Loop Decision
builder.add_conditional_edges(
    "critique",
    route_critique,
    {
        "refine": "narrative", # Loop back to fix things
        "finalize": END        # Done with this batch
    }
)

graph = builder.compile()