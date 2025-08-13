"""
Configuration for Aurum Bespoke Video Automation - COST FREE VERSION
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

# Assets - Auto-copy from existing logo if overlay.png missing
OVERLAY_PATH = AUTOMATION_DIR / "overlay.png"
FALLBACK_LOGO = ASSETS_DIR / "logos" / "aurum-logo-gold.png"

# Video specifications
VIDEO_WIDTH = 1080
VIDEO_HEIGHT = 1920  # 9:16 aspect ratio for mobile
VIDEO_FPS = 24
VIDEO_DURATION = 20  # seconds

# Daily limits
DAILY_VIDEO_LIMIT = 3  # Maximum videos per day

# API Configuration - COST FREE VERSION
# Telegram (from environment variables with fallbacks)
TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN") or os.getenv("TELEGRAM_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID") or os.getenv("TELEGRAM_ID", "").strip()

# Brand information (with defaults)
AURUM_BRAND = os.getenv("AURUM_BRAND", "Aurum Bespoke")
AURUM_PHONE = os.getenv("AURUM_PHONE", "+918105508503")
AURUM_SITE = os.getenv("AURUM_SITE", "www.aurumbespoke.com")

# COST FREE AI Alternatives
# Story Generation - Free alternatives to OpenAI
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "").strip()  # Free tier available
HUGGINGFACE_MODEL = "microsoft/DialoGPT-medium"  # Free text generation

# TTS - Free alternatives to ElevenLabs
# Primary: gTTS (Google Text-to-Speech) - FREE
GTTS_LANGUAGE = "en"
GTTS_SLOW = False

# Fallback: espeak (local) - FREE
ESPEAK_VOICE = "en-us"
ESPEAK_SPEED = 150

# Image Generation - Free alternatives to Leonardo/Hailuo
# Primary: Stable Diffusion API (free tier) - FREE
STABLE_DIFFUSION_API_KEY = os.getenv("STABLE_DIFFUSION_API_KEY", "").strip()
STABLE_DIFFUSION_URL = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"

# Fallback: Local generation using existing assets - FREE
LOCAL_IMAGE_FALLBACK = True

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

# AGGRESSIVE BANGALORE/KARNATAKA HASHTAGS (30+ tags)
AGGRESSIVE_HASHTAGS = [
    # Bangalore Priority (High Traffic)
    "#Bangalore", "#Bengaluru", "#NammaBengaluru", "#BangaloreFashion", "#BangaloreLuxury",
    "#BangaloreStyle", "#BangaloreMenswear", "#BangaloreTailor", "#BangaloreBespoke",
    
    # Bangalore Neighborhoods (High Traffic)
    "#Indiranagar", "#Koramangala", "#HSRLAYOUT", "#Whitefield", "#ElectronicCity",
    "#JPnagar", "#Jayanagar", "#Basavanagudi", "#Banashankari", "#BTM",
    "#Marathahalli", "#Bellandur", "#Hebbal", "#Yelahanka", "#Malleshwaram",
    "#Rajajinagar", "#Sadashivanagar", "#Ulsoor", "#FrazerTown", "#KalyanNagar",
    "#MGroad", "#BrigadeRoad", "#ChurchStreet", "#LavelleRoad", "#CunninghamRoad",
    
    # Karnataka (Medium Traffic)
    "#Karnataka", "#KarnatakaFashion", "#KarnatakaLuxury", "#KarnatakaStyle",
    
    # Brand & Style (High Traffic)
    "#AurumBespoke", "#AurumBespokeBangalore", "#LuxuryMenswear", "#Bespoke",
    "#Menswear", "#Tailoring", "#MadeToMeasure", "#Handcrafted", "#Premium",
    "#Exclusive", "#Luxury", "#Fashion", "#Style", "#Elegance", "#Sophistication",
    
    # Specific Categories (High Traffic)
    "#Suit", "#Suits", "#Sherwani", "#Sherwanis", "#Tuxedo", "#Tuxedos",
    "#Bandgala", "#Pathani", "#ModiJacket", "#Blazer", "#BespokeSuits",
    "#WeddingWear", "#GroomStyle", "#IndianGroom", "#GroomOutfit",
    
    # Business & Professional (Medium Traffic)
    "#BusinessWear", "#ProfessionalStyle", "#CorporateFashion", "#OfficeStyle",
    "#InterviewStyle", "#FormalWear", "#BusinessSuit", "#ProfessionalLook"
]

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
    "negative_prompt": "blurry, low quality, distorted, watermark, text, logo"
}

# Error handling
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds
TIMEOUT = 120  # seconds for API calls
PER_OUTFIT_TIMEOUT = 480  # 8 minutes per outfit

# Logging
LOG_LEVEL = "INFO"
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
LOG_FILE = AUTOMATION_DIR / "automation.log"

# Performance
ENABLE_CACHING = True
CACHE_TTL = 3600  # 1 hour
MAX_CONCURRENT_REQUESTS = 2  # Reduced for free tier limits

# Safety
ENABLE_SAFETY_FILTERS = True
MAX_DAILY_API_CALLS = 50  # Reduced for free tier limits
RATE_LIMIT_DELAY = 2  # seconds between API calls

# Hashtag rotation settings
HASHTAG_ROTATION_SIZE = 30  # Number of hashtags to rotate through
HASHTAG_PERSISTENCE_FILE = AUTOMATION_DIR / "hashtag_rotation.json"