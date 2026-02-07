# 📚 Research to Slides AI

**Transform ArXiv papers into professional presentations in seconds.**

This project uses a multi-agent **LangGraph** system to ingest LaTeX source from ArXiv, analyze the narrative structure, and generate high-quality presentations in PPTX, Beamer, and Google Slides formats.

**Deployed Link:** [https://presentation-agent-ar-full-stack.onrender.com/](https://presentation-agent-ar-full-stack.onrender.com/)

---

## 🤖 Multi-Agent Architecture

The core of this application is an intelligent pipeline where specialized AI agents collaborate to create the final presentation.

### 1. ✍️ Narrative Agent
The **Narrative Agent** is the architect of the presentation content.
* **Initial Generation:** Analyzes raw LaTeX source (Title, Abstract, Methodology, Results) to create an 8-10 slide structure.
* **Plain English Constraint:** Translates complex LaTeX math and code into readable, plain English (e.g., converting `\frac{a}{b}` to "a divided by b").
* **Iterative Refinement:** Modifies the JSON structure based on internal critique or user feedback to either expand details or increase conciseness.

### 2. 🧐 Critique Agent
The **Critique Agent** serves as the quality control gatekeeper.
* **Review Process:** Evaluates the narrative flow, clarity of bullet points, and completeness of sections (ensuring "Results" or "Methodology" are included).
* **Sanitization:** Checks for any accidental LaTeX code leaks that should have been plain text.
* **Feedback Loop:** Outputs specific "FIX" instructions to trigger a refinement loop or "LOOKS GOOD" to finalize the process.

### 3. 🎨 Design Agent
The **Design Agent** manages the visual hierarchy and layout.
* **Layout Logic:** Dynamically switches between `two_column` and `title_content` layouts based on the number of bullet points.
* **Emphasis:** Assigns an emphasis type (`visual` or `text`) based on keywords in the slide title, prioritizing visuals for results-oriented slides.

### 4. 📊 PPTX Agent
The **Generative PPTX Engine** builds physical PowerPoint files.
* **Modern Aesthetics:** Uses a 16:9 widescreen format with a professional blue-accented color scheme and clean typography (Arial and Georgia).
* **Dynamic Elements:** Incorporates rounded rectangles and subtle background tints to highlight key points.

### 5. 📐 Beamer Agent
The **Beamer Agent** generates academic-ready LaTeX Beamer code.
* **Theming:** Utilizes the `Madrid` theme with the `dolphin` color theme for a classic research presentation look.
* **Optimization:** Features an "auto-shrink" capability to ensure text-heavy content fits within the frame boundaries.

---

## 🛠️ Technical Stack

* **Orchestration:** LangGraph (StateGraph) for managing agentic workflows.
* **Backend:** FastAPI & Python-pptx.
* **Frontend:** React (Vite) with Lucide-React icons.
* **LLM:** Integrated via OpenRouter/LLM utility module.

---

## 🚀 Getting Started
### Option-1
1.  **Environment Setup:** Create a `.env` file in the root directory with your API keys.
2.  **Install Dependencies:**
    ```bash
    pip install -r backend/requirements.txt
    cd frontend && npm install
    ```
3.  **Run Application:**
    * Backend: `python backend/app.py`
    * Frontend: `npm run dev`

### Option-2
1. Run the IPYNB file by adding your keys
