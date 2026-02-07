from pydantic import BaseModel
from typing import List, Optional

class SlideDesign(BaseModel):
    background: str              # e.g. "gradient_blue", "dark", "light"
    title_font: str              # e.g. "Montserrat", "Inter"
    accent_color: str            # hex color
    visual: Optional[str] = None # icon:healthcare | image:brain_scan
    animation: Optional[str] = None  # fade_in, slide_left

class Slide(BaseModel):
    title: str
    bullets: List[str]
    layout: str                  # title_content, two_column
    design: SlideDesign          # 👈 THIS IS NEW

class Presentation(BaseModel):
    audience: str
    theme: str
    slides: List[Slide]
