# agents/design_agent.py
def design_agent(state):
    slides = state["presentation"]["slides"]

    for s in slides:
        if len(s["bullets"]) > 4:
            s["layout"] = "two_column"
        else:
            s["layout"] = "title_content"

        s["emphasis"] = "visual" if "result" in s["title"].lower() else "text"

    return state
