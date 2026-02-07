# backend/app.py
import os
import shutil
import uuid
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional

# Import your existing modules
from graph import graph
from utils.arxiv_loader import load_tex_from_source

app = FastAPI()

# Enable CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store (Note: For production, use Redis)
SESSIONS = {}

class InitRequest(BaseModel):
    source_type: str  # "arxiv" or "dummy"
    input_value: Optional[str] = None

class RefineRequest(BaseModel):
    session_id: str
    feedback: str

@app.post("/api/generate")
async def generate_presentation(req: InitRequest):
    session_id = str(uuid.uuid4())
    
    # 1. Load Content
    try:
        if req.source_type == "arxiv":
            tex_content = load_tex_from_source(req.input_value)
        else:
            tex_content = r"\documentclass{article}\title{AI Future}\begin{document}Dummy content...\end{document}"
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 2. Initialize State
    state = {
        "tex_content": tex_content,
        "output_format": "pptx", # Defaulting to PPTX for web download
        "audience": "General",
        "iteration": 0,
        "critique": "",
        "user_feedback": "",
        "presentation": None
    }

    # 3. Run Graph (Blocking for simplicity, can be async)
    print(f"🚀 Starting Session {session_id}")
    final_state = graph.invoke(state)
    
    # 4. Save Session
    SESSIONS[session_id] = final_state
    
    return {
        "session_id": session_id,
        "slides": final_state.get("presentation", {}).get("slides", []),
        "status": "completed"
    }

@app.post("/api/refine")
async def refine_presentation(req: RefineRequest):
    session_id = req.session_id
    if session_id not in SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found")
    
    state = SESSIONS[session_id]
    
    # Update State for Refinement
    state["iteration"] = 0 # Reset internal loop
    state["user_feedback"] = req.feedback
    state["critique"] = "User requested changes."
    
    print(f"🔄 Refining Session {session_id}")
    final_state = graph.invoke(state)
    SESSIONS[session_id] = final_state
    
    return {
        "session_id": session_id,
        "slides": final_state.get("presentation", {}).get("slides", []),
        "status": "refined"
    }

@app.get("/api/download/{session_id}")
async def download_file(session_id: str):
    if session_id not in SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # In a real app, you'd return the file stream. 
    # Since your agents save to 'output.pptx' locally, 
    # we need to manage unique filenames per session in your agents.
    # For this demo, we assume the file exists at root.
    
    file_path = "output.pptx" 
    if not os.path.exists(file_path):
         raise HTTPException(status_code=404, detail="File not generated yet")
         
    from fastapi.responses import FileResponse
    return FileResponse(file_path, filename=f"presentation_{session_id}.pptx")

# Serve React Frontend (Production)
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")