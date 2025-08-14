#!/usr/bin/env python3
import os
import sys
import json
import random
import time
import datetime as dt
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Set
import requests
import subprocess
import shlex
from PIL import Image, ImageDraw, ImageFont
import io
import base64

# ------------------------------
# Config
# ------------------------------
REPO_ROOT = Path(__file__).resolve().parents[1]
ASSETS_DIR = REPO_ROOT / "assets"
OUTPUT_DIR = REPO_ROOT / "automation" / "out"
STATE_PATH = REPO_ROOT / "automation" / "state.json"
SITE_INDEX = REPO_ROOT / "index.html"

# Canvas config (vertical 9:16 format for Instagram/TikTok)
CANVAS_W = 1080
CANVAS_H = 1920
BACKGROUND_COLOR = (0, 0, 0)  # pure black to match site theme
WATERMARK_RELATIVE_WIDTH = 0.16  # watermark width relative to canvas width
WATERMARK_MARGIN = 28  # px from edges

# Daily posting limits
DAILY_POST_TARGET = 5
DAILY_VIDEO_TARGET = 1

# Telegram
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_ID", "").strip()
TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}"

# Services with consistent character prompts
SERVICE_CONFIG = {
    "Suit": {
        "prompt": "professional indian male model wearing bespoke suit, luxury tailoring, high quality, detailed, 9:16 aspect ratio, studio lighting",
        "emojis": "🕴️✨",
        "caption": "Aurum Bespoke Suit — hand-cut, precision-tailored, and finished for commanding presence.",
        "colors": ["black", "navy", "brown", "charcoal"]
    },
    "Tuxedo": {
        "prompt": "elegant indian male model wearing black tuxedo, formal wear, luxury, high quality, detailed, 9:16 aspect ratio, sophisticated lighting",
        "emojis": "🎩🌙",
        "caption": "Black‑tie mastery. An Aurum Tuxedo that speaks in whispers and is heard across the room.",
        "colors": ["black", "midnight", "ivory"]
    },
    "Sherwani": {
        "prompt": "handsome indian male model wearing traditional sherwani, regal, celebration, luxury, high quality, detailed, 9:16 aspect ratio, festive lighting",
        "emojis": "👑🌟",
        "caption": "Regal lines. Modern ease. The Aurum Sherwani — crafted for celebrations that matter.",
        "colors": ["cream", "maroon", "gold"]
    },
    "Kurta Pathani": {
        "prompt": "stylish indian male model wearing kurta pathani, traditional indian wear, comfort, high quality, detailed, 9:16 aspect ratio, natural lighting",
        "emojis": "🧵🌿",
        "caption": "Classic comfort with tailored sharpness — Kurta Pathani by Aurum Bespoke.",
        "colors": ["black", "white", "olive"]
    },
    "Bandgala": {
        "prompt": "distinguished indian male model wearing bandgala, structured jacket, luxury, high quality, detailed, 9:16 aspect ratio, elegant lighting",
        "emojis": "🥇🔥",
        "caption": "Bandgala by Aurum — structured, stately, and unmistakably elegant.",
        "colors": ["white", "black", "royal blue"]
    },
    "Tailored Shirt": {
        "prompt": "refined indian male model wearing tailored shirt, business casual, luxury, high quality, detailed, 9:16 aspect ratio, professional lighting",
        "emojis": "👔✨",
        "caption": "Subtle details. Impeccable fit. The Aurum Tailored Shirt elevates every day.",
        "colors": ["white", "sky blue", "charcoal"]
    },
    "Modi Jacket": {
        "prompt": "elegant indian male model wearing modi jacket, sleeveless, traditional, luxury, high quality, detailed, 9:16 aspect ratio, warm lighting",
        "emojis": "🇮🇳✨",
        "caption": "Iconic Modi Jacket — timeless, versatile, and tailored to perfection.",
        "colors": ["black", "cream", "rust"]
    },
}

SERVICE_KEYS: List[str] = list(SERVICE_CONFIG.keys())

# Hashtag pools for Bangalore/Karnataka rotation
BANGALORE_NEIGHBORHOODS = [
    "#Indiranagar", "#Koramangala", "#HSRLAYOUT", "#Whitefield", "#ElectronicCity",
    "#JPnagar", "#Jayanagar", "#Basavanagudi", "#Banashankari", "#BTM",
    "#Marathahalli", "#Bellandur", "#Hebbal", "#Yelahanka", "#Malleshwaram",
    "#Rajajinagar", "#Sadashivanagar", "#Ulsoor", "#FrazerTown", "#KalyanNagar",
    "#MGroad", "#BrigadeRoad", "#ChurchStreet", "#LavelleRoad",
]
GENERAL_STYLE = [
    "#AurumBespoke", "#Menswear", "#MensStyle", "#LuxuryMenswear", "#Bespoke",
    "#Tailoring", "#MadeToMeasure", "#SuitUp", "#SharpStyle", "#TailorMade",
    "#SavileRowSpirit", "#EveningWear", "#GroomStyle", "#WeddingWear",
]
KARNATAKA_TAGS = [
    "#Bangalore", "#Bengaluru", "#Karnataka", "#NammaBengaluru", "#KarnatakaFashion",
    "#BangaloreFashion", "#BangaloreLuxury", "#FashionBangalore",
]
CATEGORY_TAGS = [
    "#Suit", "#Suits", "#Tuxedo", "#Tuxedos", "#Sherwani", "#Sherwanis",
    "#Bandgala", "#BandgalaStyle", "#Pathani", "#PathaniSuit", "#Blazer",
    "#KurtaPathani", "#BespokeSuits", "#MensOutfit", "#IndianGroom", "#GroomOutfit",
]

TOTAL_HASHTAGS = 22
BRAND_HANDLE = "@aurum.bespoke"

def load_state() -> Dict:
    """Load state from JSON file."""
    if STATE_PATH.exists():
        with open(STATE_PATH, 'r') as f:
            return json.load(f)
    return {
        "last_slno": 0,
        "last_post_date": "",
        "count_today": 0,
        "used_today": [],
        "last_video_date": "",
        "video_count_today": 0,
        "last_video_service": "",
        "generated_images": {},
        "generated_videos": {}
    }

def save_state(state: Dict) -> None:
    """Save state to JSON file."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(STATE_PATH, 'w') as f:
        json.dump(state, f, indent=2)

def pick_today_target(state: Dict) -> None:
    """Reset daily counters if it's a new day."""
    today = dt.date.today().isoformat()
    if state.get("last_post_date") != today:
        state["last_post_date"] = today
        state["count_today"] = 0
        state["used_today"] = []
    
    if state.get("last_video_date") != today:
        state["last_video_date"] = today
        state["video_count_today"] = 0

def generate_placeholder_image(service: str, color_name: str) -> Path:
    """Generate a placeholder image with text for now."""
    # Create a new image with the specified dimensions
    img = Image.new('RGB', (CANVAS_W, CANVAS_H), BACKGROUND_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Try to use a default font, fallback to basic if not available
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
        font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)
    except:
        try:
            font_large = ImageFont.load_default()
            font_medium = ImageFont.load_default()
        except:
            # Create a basic font
            font_large = None
            font_medium = None
    
    # Draw service name
    service_text = f"Aurum Bespoke"
    if font_large:
        bbox = draw.textbbox((0, 0), service_text, font=font_large)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (CANVAS_W - text_width) // 2
        y = CANVAS_H // 4
        draw.text((x, y), service_text, fill=(201, 158, 103), font=font_large)  # Gold color
    
    # Draw service type
    service_type = service
    if font_large:
        bbox = draw.textbbox((0, 0), service_type, font=font_large)
        text_width = bbox[2] - bbox[0]
        x = (CANVAS_W - text_width) // 2
        y = y + text_height + 20
        draw.text((x, y), service_type, fill=(255, 255, 255), font=font_large)
    
    # Draw color
    color_text = f"Color: {color_name.title()}"
    if font_medium:
        bbox = draw.textbbox((0, 0), color_text, font=font_medium)
        text_width = bbox[2] - bbox[0]
        x = (CANVAS_W - text_width) // 2
        y = y + text_height + 40
        draw.text((x, y), color_text, fill=(201, 158, 103), font=font_medium)
    
    # Draw decorative elements
    draw.rectangle([100, CANVAS_H - 200, CANVAS_W - 100, CANVAS_H - 150], outline=(201, 158, 103), width=3)
    
    # Save the image
    image_path = OUTPUT_DIR / f"{service.lower().replace(' ', '_')}_{int(time.time())}.png"
    img.save(image_path)
    
    return image_path

def add_watermark_and_caption(image_path: Path, service: str, slno: int, variant: str, style: str, color_name: str, seed: int) -> Tuple[Path, str]:
    """Add watermark and prepare caption."""
    # Create output path
    out_path = OUTPUT_DIR / f"post_{slno:03d}_{service.lower().replace(' ', '_')}.png"
    
    # For now, just copy the image (watermark can be added later if needed)
    import shutil
    shutil.copy2(image_path, out_path)
    
    # Build caption
    emojis = SERVICE_CONFIG[service]["emojis"]
    core_caption = SERVICE_CONFIG[service]["caption"]
    
    # Select hashtags
    hashtags = []
    hashtags.extend(random.sample(BANGALORE_NEIGHBORHOODS, 6))
    hashtags.extend(random.sample(GENERAL_STYLE, 8))
    hashtags.extend(random.sample(KARNATAKA_TAGS, 4))
    hashtags.extend(random.sample(CATEGORY_TAGS, 4))
    
    hashtag_str = " ".join(hashtags)
    handle = BRAND_HANDLE
    slno_str = f"{slno:03d}"
    
    caption = (
        f"Aurum Bespoke | {service} ({color_name})\n"
        f"SL No: {slno_str}\n\n"
        f"{emojis} {core_caption}\n\n"
        f"Book Your Home Visit\n"
        f"WhatsApp: +91 81055 08503\n"
        f"Website: www.aurumbespoke.com\n\n"
        f"{handle}\n\n"
        f"{hashtag_str}"
    )
    
    return out_path, caption

def send_to_telegram(media_path: Path, caption: str, is_video: bool = False) -> None:
    """Send media to Telegram."""
    if not TELEGRAM_TOKEN or not TELEGRAM_CHAT_ID:
        raise RuntimeError("TELEGRAM_TOKEN/TELEGRAM_ID not set in environment.")
    
    endpoint = "sendVideo" if is_video else "sendPhoto"
    url = f"{TELEGRAM_API}/{endpoint}"
    
    for attempt in range(3):
        try:
            with open(media_path, "rb") as f:
                files = {"video" if is_video else "photo": f}
                data = {"chat_id": TELEGRAM_CHAT_ID, "caption": caption}
                resp = requests.post(url, data=data, files=files, timeout=60)
                if resp.status_code == 200:
                    return
                err = f"Telegram API error: {resp.status_code} {resp.text}"
                if attempt == 2:
                    raise RuntimeError(err)
        except Exception as e:
            if attempt == 2:
                raise
        time.sleep(2 ** attempt)

def choose_service_for_image(state: Dict) -> str:
    """Choose a service for image generation that hasn't been used today."""
    used_today = set(state.get("used_today", []))
    available_services = [s for s in SERVICE_KEYS if s not in used_today]
    
    if not available_services:
        # Reset if all services used
        state["used_today"] = []
        available_services = SERVICE_KEYS
    
    return random.choice(available_services)

def choose_service_for_video(state: Dict) -> str:
    """Choose service for video based on daily rotation."""
    today = dt.date.today()
    days_since_epoch = (today - dt.date(1970, 1, 1)).days
    service_index = days_since_epoch % len(SERVICE_KEYS)
    return SERVICE_KEYS[service_index]

def main() -> int:
    """Main function."""
    state = load_state()
    pick_today_target(state)
    
    # Generate and send image post
    if state.get("count_today", 0) < DAILY_POST_TARGET:
        service = choose_service_for_image(state)
        color_name = random.choice(SERVICE_CONFIG[service]["colors"])
        
        print(f"Generating image for {service}...")
        image_path = generate_placeholder_image(service, color_name)
        
        if image_path:
            next_slno = int(state.get("last_slno", 0)) + 1
            if next_slno > 999:
                next_slno = 1
            
            # Generate variant and style
            variant = random.choice(["none", "contrast", "warm", "cool", "golden_glow"])
            style = random.choice(["none", "crop_zoom", "vignette", "gold_border", "soft_focus", "gradient_overlay"])
            seed = random.randint(1000, 9999)
            
            photo_path, caption = add_watermark_and_caption(
                image_path, service, next_slno, variant, style, color_name, seed
            )
            
            send_to_telegram(photo_path, caption)
            
            # Update state
            state["last_slno"] = next_slno
            state["count_today"] = state.get("count_today", 0) + 1
            state["used_today"].append(service)
            
            print(f"Sent image post {next_slno:03d} for service: {service}")
        else:
            print("Failed to generate image")
            return 1
    
    # For now, skip video generation until we have a working solution
    # This will be implemented later with proper video generation
    
    save_state(state)
    return 0

if __name__ == "__main__":
    sys.exit(main())