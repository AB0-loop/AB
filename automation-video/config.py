"""
Configuration for Aurum Bespoke Video Automation
Exact specifications as per brief
"""

import os
from pathlib import Path
from datetime import datetime, timedelta
import pytz

# Paths
AUTOMATION_DIR = Path(__file__).parent
OUTPUT_DIR = AUTOMATION_DIR / "out"
TEMP_DIR = AUTOMATION_DIR / "temp"
STATE_FILE = AUTOMATION_DIR / "state.json"
BUCKETS_FILE = AUTOMATION_DIR / "buckets.json"
HASHTAG_BANK_FILE = AUTOMATION_DIR / "hashtag_bank_blr.txt"
OVERLAY_FILE = AUTOMATION_DIR / "overlay.png"

# Video Specifications (exact as per brief)
VIDEO_WIDTH = 1080
VIDEO_HEIGHT = 1920
VIDEO_DURATION = 20
VIDEO_FPS = 24
WATERMARK_MARGIN = 20
WATERMARK_MAX_WIDTH = 600

# Outfits (exact as per brief)
OUTFITS = ["suit", "bandhgala", "modi_jacket", "kurta", "sherwani", "tuxedo"]
DAILY_VIDEO_COUNT = 3

# Scene Parameters (deterministic rotation)
SCENE_STYLES = ["runway-golden-hour", "palace-marble-hall", "studio-softbox", "heritage-courtyard", "urban-rooftop", "grand-staircase"]
CAMERA_MOVES = ["slow dolly-in", "orbit 30°", "tracking walk", "tilt with reveal", "push-in then hold"]
COLOR_THEMES = ["ivory", "charcoal", "navy", "deep green", "maroon", "sand", "black"]

# Settings mapping
SETTINGS_MAP = {
    "runway-golden-hour": "luxury fashion runway during golden hour",
    "palace-marble-hall": "grand palace with marble floors and columns",
    "studio-softbox": "professional photography studio with soft lighting",
    "heritage-courtyard": "traditional Indian heritage courtyard",
    "urban-rooftop": "modern city rooftop with skyline view",
    "grand-staircase": "elegant staircase in luxury venue"
}

# Environment Variables (required)
REQUIRED_ENV_VARS = [
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_CHAT_ID", 
    "OPENAI_API_KEY",
    "ELEVENLABS_KEY",
    "HAILUO_API_KEY",
    "AURUM_PHONE",
    "AURUM_SITE",
    "AURUM_BRAND"
]

# Optional Environment Variables
OPTIONAL_ENV_VARS = [
    "PLAYHT_KEY",
    "LEONARDO_API_KEY", 
    "ELEVENLABS_VOICE_ID"
]

# API Configuration
OPENAI_MODEL = "gpt-4o-mini"
OPENAI_TEMPERATURE = 0.8
OPENAI_MAX_TOKENS = 120

ELEVENLABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"
ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1"

PLAYHT_BASE_URL = "https://api.play.ht/api/v2"

LEONARDO_BASE_URL = "https://cloud.leonardo.ai/api/rest/v1"
HAILUO_BASE_URL = "https://api.hailuo.tech/v1"

# Timeouts and Limits
API_TIMEOUT = 180
PER_OUTFIT_TIMEOUT = 480  # 8 minutes
MAX_RETRIES = 2
RETRY_DELAYS = [2, 4]  # exponential backoff

# Hashtag Requirements (must include these exactly)
MANDATORY_HASHTAGS = [
    "#AurumBespoke", "#Bangalore", "#Bengaluru", "#Karnataka", 
    "#BangaloreFashion", "#Menswear", "#Sherwani", "#Bandhgala", 
    "#ModiJacket", "#Suit", "#Kurta", "#WeddingFashion", 
    "#IndianGroom", "#BespokeTailoring", "#MadeToMeasure"
]

HASHTAGS_PER_VIDEO = 25

# Story Requirements
STORY_MIN_WORDS = 45
STORY_MAX_WORDS = 60
STORY_MUST_INCLUDE = "Aurum Bespoke"
STORY_MUST_END = "Book your home appointment now."

def load_env_with_validation():
    """Load and validate environment variables"""
    missing_vars = []
    
    for var in REQUIRED_ENV_VARS:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")
    
    # Validate AURUM_BRAND is exactly "Aurum Bespoke"
    if os.getenv("AURUM_BRAND") != "Aurum Bespoke":
        raise ValueError("AURUM_BRAND must be exactly 'Aurum Bespoke'")
    
    return {
        "telegram_token": os.getenv("TELEGRAM_BOT_TOKEN"),
        "telegram_chat_id": os.getenv("TELEGRAM_CHAT_ID"),
        "openai_key": os.getenv("OPENAI_API_KEY"),
        "elevenlabs_key": os.getenv("ELEVENLABS_KEY"),
        "playht_key": os.getenv("PLAYHT_KEY"),
        "leonardo_key": os.getenv("LEONARDO_API_KEY"),
        "hailuo_key": os.getenv("HAILUO_API_KEY"),
        "aurum_phone": os.getenv("AURUM_PHONE"),
        "aurum_site": os.getenv("AURUM_SITE"),
        "aurum_brand": os.getenv("AURUM_BRAND"),
        "elevenlabs_voice_id": os.getenv("ELEVENLABS_VOICE_ID", ELEVENLABS_VOICE_ID)
    }

def get_ist_date():
    """Get current IST date string"""
    ist = pytz.timezone('Asia/Kolkata')
    now = datetime.now(ist)
    return now.strftime("%Y%m%d")

def get_slno_prefix():
    """Get SLNo prefix for today"""
    return f"AB-{get_ist_date()}-"

def get_uniqueness_key(outfit, scene_style, setting, camera_move, color_theme):
    """Generate uniqueness key for 30-day tracking"""
    return f"{outfit}|{scene_style}|{setting}|{camera_move}|{color_theme}"

def is_within_30_days(timestamp_str):
    """Check if timestamp is within 30 days"""
    try:
        timestamp = datetime.fromisoformat(timestamp_str)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        return timestamp > thirty_days_ago
    except:
        return False