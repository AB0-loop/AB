"""
Configuration for Aurum Bespoke Video Automation
"""

import os
from pathlib import Path

# Repository paths
REPO_ROOT = Path(__file__).resolve().parents[1]
ASSETS_DIR = REPO_ROOT / "assets"
AUTOMATION_DIR = REPO_ROOT / "automation-video"

# Output and temporary directories
OUTPUT_DIR = AUTOMATION_DIR / "out"
TEMP_DIR = AUTOMATION_DIR / "temp"

# Configuration files
STATE_PATH = AUTOMATION_DIR / "state.json"
BUCKETS_PATH = AUTOMATION_DIR / "buckets.json"
HASHTAG_BANK_PATH = AUTOMATION_DIR / "hashtag_bank_blr.txt"

# Assets
OVERLAY_PATH = ASSETS_DIR / "logos" / "aurum-logo-gold.png"

# Video specifications
VIDEO_WIDTH = 1080
VIDEO_HEIGHT = 1920  # 9:16 aspect ratio for mobile
VIDEO_FPS = 24
VIDEO_DURATION = 20  # seconds

# Daily limits
DAILY_VIDEO_LIMIT = 2  # Maximum videos per day

# API Configuration
# Telegram (from environment variables)
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_ID", "").strip()

# OpenAI (for story generation)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
OPENAI_MODEL = "gpt-3.5-turbo"

# ElevenLabs (for TTS)
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "").strip()
ELEVENLABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # Rachel voice

# PlayHT (alternative TTS)
PLAYHT_API_KEY = os.getenv("PLAYHT_API_KEY", "").strip()
PLAYHT_USER_ID = os.getenv("PLAYHT_USER_ID", "").strip()

# Leonardo AI (for image generation)
LEONARDO_API_KEY = os.getenv("LEONARDO_API_KEY", "").strip()

# Hailuo (alternative image generation)
HAILUO_API_KEY = os.getenv("HAILUO_API_KEY", "").strip()

# Content buckets for variety
DEFAULT_BUCKETS = {
    "services": [
        "Bespoke Suit",
        "Sherwani",
        "Tuxedo",
        "Bandgala",
        "Pathani Suit",
        "Modi Jacket",
        "Tailored Shirt",
        "Blazer"
    ],
    "styles": [
        "Classic",
        "Modern",
        "Traditional",
        "Contemporary",
        "Vintage",
        "Minimalist",
        "Luxury",
        "Elegant"
    ],
    "occasions": [
        "Wedding",
        "Business Meeting",
        "Festival",
        "Party",
        "Formal Event",
        "Interview",
        "Celebration",
        "Special Occasion"
    ],
    "emotions": [
        "Confident",
        "Elegant",
        "Powerful",
        "Sophisticated",
        "Professional",
        "Stylish",
        "Timeless",
        "Premium"
    ],
    "colors": [
        "Black",
        "Navy",
        "Charcoal",
        "Brown",
        "Cream",
        "White",
        "Burgundy",
        "Olive"
    ]
}

# Hashtag categories
HASHTAG_CATEGORIES = {
    "brand": ["#AurumBespoke", "#AurumBespokeBangalore"],
    "location": ["#Bangalore", "#Bengaluru", "#Karnataka", "#NammaBengaluru"],
    "style": ["#Menswear", "#Bespoke", "#Tailoring", "#LuxuryMenswear"],
    "occasion": ["#Wedding", "#Business", "#Formal", "#Celebration"],
    "quality": ["#MadeToMeasure", "#Handcrafted", "#Premium", "#Exclusive"]
}

# Video composition settings
VIDEO_SETTINGS = {
    "watermark_size": 200,  # pixels
    "watermark_margin": 20,  # pixels from edge
    "text_font": "Arial",
    "text_size": 48,
    "text_color": "white",
    "background_color": "black"
}

# TTS settings
TTS_SETTINGS = {
    "voice_speed": 150,  # words per minute
    "voice_pitch": 100,  # percentage
    "voice_volume": 100,  # percentage
    "language": "en-us"
}

# Image generation settings
IMAGE_SETTINGS = {
    "width": 1080,
    "height": 1920,
    "style": "photographic",
    "quality": "high",
    "negative_prompt": "blurry, low quality, distorted, watermark"
}

# Error handling
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds
TIMEOUT = 120  # seconds for API calls

# Logging
LOG_LEVEL = "INFO"
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
LOG_FILE = AUTOMATION_DIR / "automation.log"

# Performance
ENABLE_CACHING = True
CACHE_TTL = 3600  # 1 hour
MAX_CONCURRENT_REQUESTS = 3

# Safety
ENABLE_SAFETY_FILTERS = True
MAX_DAILY_API_CALLS = 100
RATE_LIMIT_DELAY = 1  # seconds between API calls