# # backend/app.py
# import os
# import shutil
# import uuid
# from fastapi import FastAPI, HTTPException, BackgroundTasks
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from pydantic import BaseModel
# from typing import Optional

# # Import your existing modules
# from graph import graph
# from utils.arxiv_loader import load_tex_from_source

# app = FastAPI()

# # Enable CORS for local dev
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # In-memory session store (Note: For production, use Redis)
# SESSIONS = {}

# class InitRequest(BaseModel):
#     source_type: str  # "arxiv" or "dummy"
#     input_value: Optional[str] = None

# class RefineRequest(BaseModel):
#     session_id: str
#     feedback: str

# @app.post("/api/generate")
# async def generate_presentation(req: InitRequest):
#     session_id = str(uuid.uuid4())
    
#     # 1. Load Content
#     try:
#         if req.source_type == "arxiv":
#             tex_content = load_tex_from_source(req.input_value)
#         else:
#             tex_content = r"\documentclass{article}\title{AI Future}\begin{document}Dummy content...\end{document}"
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))

#     # 2. Initialize State
#     state = {
#         "tex_content": tex_content,
#         "output_format": "pptx", # Defaulting to PPTX for web download
#         "audience": "General",
#         "iteration": 0,
#         "critique": "",
#         "user_feedback": "",
#         "presentation": None
#     }

#     # 3. Run Graph (Blocking for simplicity, can be async)
#     print(f"🚀 Starting Session {session_id}")
#     final_state = graph.invoke(state)
    
#     # 4. Save Session
#     SESSIONS[session_id] = final_state
    
#     return {
#         "session_id": session_id,
#         "slides": final_state.get("presentation", {}).get("slides", []),
#         "status": "completed"
#     }

# @app.post("/api/refine")
# async def refine_presentation(req: RefineRequest):
#     session_id = req.session_id
#     if session_id not in SESSIONS:
#         raise HTTPException(status_code=404, detail="Session not found")
    
#     state = SESSIONS[session_id]
    
#     # Update State for Refinement
#     state["iteration"] = 0 # Reset internal loop
#     state["user_feedback"] = req.feedback
#     state["critique"] = "User requested changes."
    
#     print(f"🔄 Refining Session {session_id}")
#     final_state = graph.invoke(state)
#     SESSIONS[session_id] = final_state
    
#     return {
#         "session_id": session_id,
#         "slides": final_state.get("presentation", {}).get("slides", []),
#         "status": "refined"
#     }

# @app.get("/api/download/{session_id}")
# async def download_file(session_id: str):
#     if session_id not in SESSIONS:
#         raise HTTPException(status_code=404, detail="Session not found")
    
#     # In a real app, you'd return the file stream. 
#     # Since your agents save to 'output.pptx' locally, 
#     # we need to manage unique filenames per session in your agents.
#     # For this demo, we assume the file exists at root.
    
#     file_path = "output.pptx" 
#     if not os.path.exists(file_path):
#          raise HTTPException(status_code=404, detail="File not generated yet")
         
#     from fastapi.responses import FileResponse
#     return FileResponse(file_path, filename=f"presentation_{session_id}.pptx")

# # Serve React Frontend (Production)
# app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")




# # backend/app.py
# import os
# import uuid
# import time
# import asyncio
# from fastapi import FastAPI, HTTPException, BackgroundTasks
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse
# from fastapi.staticfiles import StaticFiles
# from pydantic import BaseModel
# from typing import Optional, List

# # Import your existing modules
# from graph import graph
# from utils.arxiv_loader import load_tex_from_source

# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Global Session Store (In-memory for simplicity)
# SESSIONS = {}

# class InitRequest(BaseModel):
#     source_type: str
#     input_value: Optional[str] = None

# class RefineRequest(BaseModel):
#     session_id: str
#     feedback: str

# # --- Helper: Logging Wrapper ---
# def add_log(session_id: str, message: str):
#     timestamp = time.strftime("%H:%M:%S")
#     if session_id in SESSIONS:
#         SESSIONS[session_id]["logs"].append(f"[{timestamp}] {message}")
#         SESSIONS[session_id]["last_update"] = time.time()

# def run_presentation_pipeline(session_id: str, source_type: str, input_value: str):
#     """Background task to run the graph and capture logs."""
#     try:
#         add_log(session_id, "🚀 Starting pipeline...")
        
#         # 1. Load Content
#         if source_type == "arxiv":
#             add_log(session_id, f"📥 Downloading source from ArXiv: {input_value}")
#             try:
#                 tex_content = load_tex_from_source(input_value)
#                 add_log(session_id, f"✅ Source loaded ({len(tex_content)} chars)")
#             except Exception as e:
#                 add_log(session_id, f"❌ Error loading source: {str(e)}")
#                 SESSIONS[session_id]["status"] = "failed"
#                 return
#         else:
#             add_log(session_id, "ℹ️ Using dummy data")
#             tex_content = r"\documentclass{article}\title{AI Future}\begin{document}Dummy content...\end{document}"

#         # 2. Initialize State
#         state = {
#             "tex_content": tex_content,
#             "output_format": "pptx", 
#             "audience": "General",
#             "iteration": 0,
#             "critique": "",
#             "user_feedback": "",
#             "presentation": None
#         }

#         # 3. Run Graph (Simulated steps for logging since graph is opaque)
#         add_log(session_id, "🧠 Narrative Agent: Analyzing paper structure...")
#         # Note: In a real production app, you'd inject a callback into LangGraph to log per-node.
#         # For now, we wrap the whole invoke.
        
#         final_state = graph.invoke(state)
        
#         # Check success
#         if final_state.get("presentation"):
#             add_log(session_id, "🎨 Design Agent: Generating slide visuals...")
#             add_log(session_id, "💾 Saving output files (PPTX & TeX)...")
            
#             # Save final state
#             SESSIONS[session_id]["state"] = final_state
#             SESSIONS[session_id]["status"] = "completed"
#             add_log(session_id, "✨ Generation Complete!")
#         else:
#             add_log(session_id, "❌ Generation returned empty results.")
#             SESSIONS[session_id]["status"] = "failed"

#     except Exception as e:
#         add_log(session_id, f"❌ Critical Error: {str(e)}")
#         SESSIONS[session_id]["status"] = "failed"

# @app.post("/api/generate")
# async def generate_presentation(req: InitRequest, background_tasks: BackgroundTasks):
#     session_id = str(uuid.uuid4())
    
#     # Initialize Session
#     SESSIONS[session_id] = {
#         "status": "processing",
#         "logs": [],
#         "state": None,
#         "created_at": time.time()
#     }
    
#     # Start Background Task
#     background_tasks.add_task(run_presentation_pipeline, session_id, req.source_type, req.input_value)
    
#     return {"session_id": session_id}

# @app.get("/api/status/{session_id}")
# async def get_status(session_id: str):
#     if session_id not in SESSIONS:
#         raise HTTPException(status_code=404, detail="Session not found")
    
#     session = SESSIONS[session_id]
#     response = {
#         "status": session["status"],
#         "logs": session["logs"]
#     }
    
#     # If completed, include the slide data for the UI
#     if session["status"] == "completed" and session["state"]:
#         response["slides"] = session["state"].get("presentation", {}).get("slides", [])
        
#     return response

# @app.post("/api/refine")
# async def refine_presentation(req: RefineRequest, background_tasks: BackgroundTasks):
#     session_id = req.session_id
#     if session_id not in SESSIONS:
#         raise HTTPException(status_code=404, detail="Session not found")
    
#     # Reset status
#     SESSIONS[session_id]["status"] = "processing"
#     add_log(session_id, f"🔄 Refinement requested: {req.feedback}")
    
#     # Get old state
#     current_state = SESSIONS[session_id]["state"]
#     current_state["iteration"] = 0
#     current_state["user_feedback"] = req.feedback
#     current_state["critique"] = "User requested changes."
    
#     # Define a simple refinement wrapper
#     def run_refinement(sess_id, state):
#         try:
#             add_log(sess_id, "🤔 Re-evaluating content based on feedback...")
#             new_state = graph.invoke(state)
#             SESSIONS[sess_id]["state"] = new_state
#             SESSIONS[sess_id]["status"] = "completed"
#             add_log(sess_id, "✅ Refinement Complete!")
#         except Exception as e:
#             add_log(sess_id, f"❌ Refinement Error: {str(e)}")
#             SESSIONS[sess_id]["status"] = "failed"

#     background_tasks.add_task(run_refinement, session_id, current_state)
    
#     return {"session_id": session_id, "status": "processing"}

# # --- Download Endpoints ---

# @app.get("/api/download/pptx/{session_id}")
# async def download_pptx(session_id: str):
#     # In a real app, ensure filenames are unique per session
#     file_path = "output.pptx" 
#     if not os.path.exists(file_path):
#          raise HTTPException(status_code=404, detail="File not found")
#     return FileResponse(file_path, filename=f"presentation_{session_id}.pptx")

# @app.get("/api/download/tex/{session_id}")
# async def download_tex(session_id: str):
#     file_path = "presentation.tex" 
#     if not os.path.exists(file_path):
#          raise HTTPException(status_code=404, detail="File not found")
#     return FileResponse(file_path, filename=f"presentation_{session_id}.tex")

# # Serve Frontend
# app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")




import os
import uuid
import time
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional

# Import your existing modules
from graph import graph
from utils.arxiv_loader import load_tex_from_source

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Session Store
SESSIONS = {}

class InitRequest(BaseModel):
    source_type: str
    input_value: Optional[str] = None

class RefineRequest(BaseModel):
    session_id: str
    feedback: str

# --- Helper: Logging Wrapper ---
def add_log(session_id: str, message: str):
    timestamp = time.strftime("%H:%M:%S")
    if session_id in SESSIONS:
        # Avoid duplicate logs
        if SESSIONS[session_id]["logs"] and message in SESSIONS[session_id]["logs"][-1]:
            return
        print(f"[{session_id}] {message}") # Print to Render console
        SESSIONS[session_id]["logs"].append(f"[{timestamp}] {message}")
        SESSIONS[session_id]["last_update"] = time.time()

def run_presentation_pipeline(session_id: str, source_type: str, input_value: str):
    """Background task to run the graph and capture logs using STREAM."""
    try:
        add_log(session_id, "🚀 Starting pipeline...")
        
        # 1. Load Content
        if source_type == "arxiv":
            add_log(session_id, f"📥 Downloading source from ArXiv: {input_value}")
            try:
                tex_content = load_tex_from_source(input_value)
                add_log(session_id, f"✅ Source loaded ({len(tex_content)} chars)")
            except Exception as e:
                add_log(session_id, f"❌ Error loading source: {str(e)}")
                SESSIONS[session_id]["status"] = "failed"
                return
        else:
            add_log(session_id, "ℹ️ Using dummy data")
            tex_content = r"\documentclass{article}\title{AI Future}\begin{document}Dummy content...\end{document}"

        # 2. Initialize State
        state = {
            "tex_content": tex_content,
            "output_format": "pptx", 
            "audience": "General",
            "iteration": 0,
            "critique": "",
            "user_feedback": "",
            "presentation": None
        }

        # 3. Run Graph with STREAMING to capture updates
        add_log(session_id, "🧠 Narrative Agent: Analyzing paper structure...")
        
        final_state = state
        # graph.stream yields dictionaries like {'narrative': updated_state}
        for output in graph.stream(state):
            for node_name, updated_state in output.items():
                final_state = updated_state # Keep tracking latest state
                
                # Log specific events based on which node finished
                if node_name == "narrative":
                     add_log(session_id, "✍️ Narrative Agent: Outline generated.")
                elif node_name == "critique":
                    # Capture the critique text!
                    critique_text = updated_state.get("critique", "")
                    if critique_text:
                        short_critique = critique_text[:100].replace("\n", " ") + "..."
                        add_log(session_id, f"🧐 Critique: {short_critique}")
                elif node_name == "pptx":
                     add_log(session_id, "🎨 PPTX Agent: Slides designed.")
                elif node_name == "beamer":
                     add_log(session_id, "📐 Beamer Agent: LaTeX generated.")

        # 4. Final Success Check
        if final_state.get("presentation"):
            add_log(session_id, "💾 Saving output files...")
            SESSIONS[session_id]["state"] = final_state
            SESSIONS[session_id]["status"] = "completed"
            add_log(session_id, "✨ Generation Complete!")
        else:
            add_log(session_id, "❌ Generation returned empty results.")
            SESSIONS[session_id]["status"] = "failed"

    except Exception as e:
        import traceback
        traceback.print_exc()
        add_log(session_id, f"❌ Critical Error: {str(e)}")
        SESSIONS[session_id]["status"] = "failed"

@app.post("/api/generate")
async def generate_presentation(req: InitRequest, background_tasks: BackgroundTasks):
    session_id = str(uuid.uuid4())
    SESSIONS[session_id] = {
        "status": "processing",
        "logs": [],
        "state": None,
        "created_at": time.time()
    }
    background_tasks.add_task(run_presentation_pipeline, session_id, req.source_type, req.input_value)
    return {"session_id": session_id}

@app.get("/api/status/{session_id}")
async def get_status(session_id: str):
    if session_id not in SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = SESSIONS[session_id]
    response = {
        "status": session["status"],
        "logs": session["logs"]
    }
    if session["status"] == "completed" and session["state"]:
        response["slides"] = session["state"].get("presentation", {}).get("slides", [])
        
    return response

@app.post("/api/refine")
async def refine_presentation(req: RefineRequest, background_tasks: BackgroundTasks):
    session_id = req.session_id
    if session_id not in SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found")
    
    SESSIONS[session_id]["status"] = "processing"
    add_log(session_id, f"🔄 Refinement requested: {req.feedback}")
    
    current_state = SESSIONS[session_id]["state"]
    current_state["iteration"] = 0
    current_state["user_feedback"] = req.feedback
    current_state["critique"] = "User requested changes."
    
    # Simple refinement wrapper reusing the stream logic if possible, 
    # or just simple invoke for speed (using invoke here for simplicity)
    def run_refinement(sess_id, state):
        try:
            add_log(sess_id, "🤔 Re-evaluating content...")
            new_state = graph.invoke(state)
            SESSIONS[sess_id]["state"] = new_state
            SESSIONS[sess_id]["status"] = "completed"
            add_log(sess_id, "✅ Refinement Complete!")
        except Exception as e:
            add_log(sess_id, f"❌ Refinement Error: {str(e)}")
            SESSIONS[sess_id]["status"] = "failed"

    background_tasks.add_task(run_refinement, session_id, current_state)
    return {"session_id": session_id, "status": "processing"}

@app.get("/api/download/pptx/{session_id}")
async def download_pptx(session_id: str):
    file_path = "output.pptx" 
    if not os.path.exists(file_path):
         raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=f"presentation_{session_id}.pptx")

@app.get("/api/download/tex/{session_id}")
async def download_tex(session_id: str):
    file_path = "presentation.tex" 
    if not os.path.exists(file_path):
         raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=f"presentation_{session_id}.tex")

app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")