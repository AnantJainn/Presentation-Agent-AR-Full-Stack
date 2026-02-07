# # llm.py
# import requests, os

# def call_llm(prompt, model="sonar-pro"):
#     r = requests.post(
#         "https://api.perplexity.ai/chat/completions",
#         headers={
#             "Authorization": f"Bearer {os.getenv('PERPLEXITY_API_KEY')}",
#             "Content-Type": "application/json"
#         },
#         json={
#             "model": model,
#             "messages": [
#                 {"role": "system", "content": "You are a presentation intelligence agent."},
#                 {"role": "user", "content": prompt}
#             ]
#         }
#     )
#     r.raise_for_status()
#     return r.json()["choices"][0]["message"]["content"]




# llm.py
import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

def call_llm(prompt, system_message="You are a helpful assistant.", model="upstage/solar-pro-3:free"):
    """
    Calls the OpenRouter API.
    """
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("❌ OPENROUTER_API_KEY not found in .env")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "http://localhost:3000", # Required by OpenRouter for some tiers
        "X-Title": "Presentation Agent",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"❌ LLM Call Failed: {e}")
        # Fallback to empty string or raise depending on preference
        return "{}"