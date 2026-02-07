# agents/google_slides_agent.py
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
import uuid

# --- ASSET LIBRARY ---
IMAGE_MAP = {
    "microchip": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Raspberry_Pi_4_Model_B_-_Side.jpg/800px-Raspberry_Pi_4_Model_B_-_Side.jpg",
    "dna": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/DNA_Overview.png/800px-DNA_Overview.png",
    "robot": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Honda_ASIMO_at_Auto_Shanghai_2011.jpg/800px-Honda_ASIMO_at_Auto_Shanghai_2011.jpg",
    "brain": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Computed_tomography_of_human_brain_-_large.png/800px-Computed_tomography_of_human_brain_-_large.png",
    "network": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Social_Network_Analysis_Visualization.png/800px-Social_Network_Analysis_Visualization.png",
    "doctor": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Physician_Assistant_Checking_Patient.jpg/800px-Physician_Assistant_Checking_Patient.jpg"
}

# --- UNIT CONVERSION (EMU) ---
PT_TO_EMU = 12700

def google_slides_agent(state):
    print("🚀 Connecting to Google Services...")
    creds = Credentials.from_service_account_file(
        "credentials.json",
        scopes=["https://www.googleapis.com/auth/presentations", "https://www.googleapis.com/auth/drive"]
    )
    slides_service = build("slides", "v1", credentials=creds)
    drive_service = build("drive", "v3", credentials=creds)

    # 1. Create File
    # IMPORTANT: Ensure this FOLDER_ID is shared with the client_email from credentials.json as 'Editor'
    FOLDER_ID = "1HZWU82y-D0BpDKUS9jFDYfDCp4f3Hyt4" 
    presentation_title = state.get("topic", "Modern Presentation")
    
    print(f"📂 Creating '{presentation_title}'...")
    
    # FIX: We create the file directly inside the folder. 
    # Because the folder belongs to YOU, the file consumes YOUR quota, not the Service Account's.
    file_metadata = {
        'name': presentation_title,
        'mimeType': 'application/vnd.google-apps.presentation',
        'parents': [FOLDER_ID] 
    }
    
    try:
        presentation = drive_service.files().create(
            body=file_metadata,
            fields='id',
            supportsAllDrives=True  # Helpful if using Shared Drives
        ).execute()
    except Exception as e:
        print(f"❌ ERROR: Could not create file. Check if Service Account has 'Editor' access to folder {FOLDER_ID}")
        print(f"Error details: {e}")
        return state

    deck_id = presentation.get('id')
    print(f"✅ Created ID: {deck_id}")

    # 2. Build Slides
    slides_data = state["presentation"]["slides"]
    requests = []
    
    for i, slide in enumerate(slides_data):
        slide_id = f"slide_{uuid.uuid4().hex}"
        
        # A. Create BLANK Slide
        requests.append({
            "createSlide": {
                "objectId": slide_id,
                "insertionIndex": i + 1,
                "slideLayoutReference": {"predefinedLayout": "BLANK"}
            }
        })
        
        # ... [SAME DESIGN LOGIC AS BEFORE] ...
        
        # B. Design Elements (The "Canva" Look)
        # 1. Accent Sidebar (Left)
        theme_hex = slide["design"].get("theme_color", "#4285F4")
        # Convert hex to 0-1 range
        hex_clean = theme_hex.lstrip('#')
        if len(hex_clean) == 6:
            r, g, b = [int(hex_clean[i:i+2], 16)/255.0 for i in (0, 2, 4)]
        else:
            r, g, b = 0.2, 0.4, 0.8 # Fallback blue

        requests.append({
            "createShape": {
                "objectId": f"accent_{slide_id}",
                "shapeType": "RECTANGLE",
                "elementProperties": {
                    "pageObjectId": slide_id,
                    "size": {"width": {"magnitude": 30, "unit": "PT"}, "height": {"magnitude": 405, "unit": "PT"}}, 
                    "transform": {"scaleX": 1, "scaleY": 1, "translateX": 0, "translateY": 0, "unit": "PT"}
                }
            }
        })
        requests.append({
            "updateShapeProperties": {
                "objectId": f"accent_{slide_id}",
                "shapeProperties": {
                    "shapeBackgroundFill": {"solidFill": {"color": {"rgbColor": {"red": r, "green": g, "blue": b}}}},
                    "outline": {"propertyState": "NOT_RENDERED"}
                },
                "fields": "shapeBackgroundFill,outline"
            }
        })

        # 2. Title Text (Top Left)
        title_box_id = f"title_{slide_id}"
        requests.append({
            "createShape": {
                "objectId": title_box_id,
                "shapeType": "TEXT_BOX",
                "elementProperties": {
                    "pageObjectId": slide_id,
                    "size": {"width": {"magnitude": 500, "unit": "PT"}, "height": {"magnitude": 60, "unit": "PT"}},
                    "transform": {"scaleX": 1, "scaleY": 1, "translateX": 50 * PT_TO_EMU, "translateY": 30 * PT_TO_EMU, "unit": "EMU"}
                }
            }
        })
        requests.append({"insertText": {"objectId": title_box_id, "text": slide["title"]}})
        requests.append({
            "updateTextStyle": {
                "objectId": title_box_id,
                "style": {"fontSize": {"magnitude": 28, "unit": "PT"}, "bold": True, "fontFamily": "Montserrat", "foregroundColor": {"opaqueColor": {"themeColor": "DARK1"}}},
                "fields": "fontSize,bold,fontFamily,foregroundColor"
            }
        })

        # 3. Content Body (Left Column)
        body_box_id = f"body_{slide_id}"
        bullet_text = "\n\n".join([f"• {b}" for b in slide["bullets"]]) 
        
        requests.append({
            "createShape": {
                "objectId": body_box_id,
                "shapeType": "TEXT_BOX",
                "elementProperties": {
                    "pageObjectId": slide_id,
                    "size": {"width": {"magnitude": 350, "unit": "PT"}, "height": {"magnitude": 300, "unit": "PT"}},
                    "transform": {"scaleX": 1, "scaleY": 1, "translateX": 50 * PT_TO_EMU, "translateY": 110 * PT_TO_EMU, "unit": "EMU"}
                }
            }
        })
        requests.append({"insertText": {"objectId": body_box_id, "text": bullet_text}})
        requests.append({
            "updateTextStyle": {
                "objectId": body_box_id,
                "style": {"fontSize": {"magnitude": 14, "unit": "PT"}, "fontFamily": "Inter", "foregroundColor": {"opaqueColor": {"themeColor": "TEXT1"}}},
                "fields": "fontSize,fontFamily,foregroundColor"
            }
        })

        # 4. Image (Right Column)
        visual_key = slide["design"].get("visual_keyword", "microchip")
        img_url = IMAGE_MAP.get(visual_key, IMAGE_MAP["microchip"])
        
        requests.append({
            "createImage": {
                "url": img_url,
                "elementProperties": {
                    "pageObjectId": slide_id,
                    "size": {"width": {"magnitude": 300, "unit": "PT"}, "height": {"magnitude": 250, "unit": "PT"}},
                    "transform": {"scaleX": 1, "scaleY": 1, "translateX": 400 * PT_TO_EMU, "translateY": 100 * PT_TO_EMU, "unit": "EMU"}
                }
            }
        })

    # Execute all
    if requests:
        print("🎨 Painting slides...")
        slides_service.presentations().batchUpdate(presentationId=deck_id, body={'requests': requests}).execute()

    print("✨ Modern Deck Generated!")
    state["google_slides_id"] = deck_id
    return state