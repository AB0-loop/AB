#!/usr/bin/env python3
"""
Test script to verify that environment variables are loaded correctly
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def test_environment_variables():
    """Test that environment variables are loaded correctly"""
    print("Testing environment variable loading...")
    
    # Test Hugging Face API key
    hf_key = os.getenv("HUGGING_FACE_API_KEY")
    if hf_key and hf_key != "YOUR_VALID_HUGGING_FACE_API_KEY_HERE":
        print("✅ Hugging Face API key loaded successfully")
        print(f"   Key starts with: {hf_key[:10]}...")
    else:
        print("⚠️  Hugging Face API key not found or using placeholder")
    
    # Test Telegram token
    telegram_token = os.getenv("TELEGRAM_TOKEN")
    if telegram_token and telegram_token != "YOUR_TELEGRAM_BOT_TOKEN_HERE":
        print("✅ Telegram token loaded successfully")
        print(f"   Token starts with: {telegram_token[:10]}...")
    else:
        print("⚠️  Telegram token not found or using placeholder")
    
    # Test Telegram chat ID
    telegram_chat_id = os.getenv("TELEGRAM_CHAT_ID")
    if telegram_chat_id and telegram_chat_id != "YOUR_TELEGRAM_CHAT_ID_HERE":
        print("✅ Telegram chat ID loaded successfully")
        print(f"   Chat ID: {telegram_chat_id}")
    else:
        print("⚠️  Telegram chat ID not found or using placeholder")
    
    print("\nEnvironment variable loading test completed!")

if __name__ == "__main__":
    test_environment_variables()