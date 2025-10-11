#!/usr/bin/env python3
import requests
import json

from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Hugging Face API configuration
HUGGING_FACE_API_KEY = os.getenv("HUGGING_FACE_API_KEY", "YOUR_VALID_HUGGING_FACE_API_KEY_HERE")
HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models"
TEXT_TO_IMAGE_MODEL = "stabilityai/stable-diffusion-2-1"

def test_hugging_face_api():
    """Test the Hugging Face API with a simple request"""
    print("Testing Hugging Face API...")
    
    headers = {"Authorization": f"Bearer {HUGGING_FACE_API_KEY}"}
    payload = {
        "inputs": "A luxury bespoke suit for Indian men, professional studio photo, high detail"
    }
    
    try:
        response = requests.post(
            f"{HUGGING_FACE_API_URL}/{TEXT_TO_IMAGE_MODEL}",
            headers=headers,
            json=payload
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("SUCCESS: Hugging Face API is working correctly")
            # Save the response to a file to check if it's an image
            with open("test_output.jpg", "wb") as f:
                f.write(response.content)
            print("Image saved as test_output.jpg")
            return True
        else:
            print(f"ERROR: {response.status_code} - {response.text}")
            # Check if it's a JSON error response
            try:
                error_data = response.json()
                print(f"Error details: {json.dumps(error_data, indent=2)}")
            except:
                print("Response content is not JSON")
            return False
    except Exception as e:
        print(f"EXCEPTION: {str(e)}")
        return False

if __name__ == "__main__":
    test_hugging_face_api()