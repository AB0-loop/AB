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
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
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

# Services with detailed prompts for realistic male characters
SERVICE_CONFIG = {
    "Suit": {
        "prompt": "professional indian male model, handsome, wearing bespoke black suit, luxury tailoring, high quality, detailed, studio lighting, fashion photography, 9:16 aspect ratio, sharp focus, professional portrait",
        "emojis": "🕴️✨",
        "caption": "Aurum Bespoke Suit — hand-cut, precision-tailored, and finished for commanding presence.",
        "colors": ["black", "navy", "brown", "charcoal"],
        "style": "formal_business"
    },
    "Tuxedo": {
        "prompt": "elegant indian male model, handsome, wearing black tuxedo, formal evening wear, luxury, high quality, detailed, sophisticated lighting, fashion photography, 9:16 aspect ratio, sharp focus, professional portrait",
        "emojis": "🎩🌙",
        "caption": "Black‑tie mastery. An Aurum Tuxedo that speaks in whispers and is heard across the room.",
        "colors": ["black", "midnight", "ivory"],
        "style": "formal_evening"
    },
    "Sherwani": {
        "prompt": "handsome indian male model, wearing traditional sherwani, regal, celebration, luxury, high quality, detailed, festive lighting, fashion photography, 9:16 aspect ratio, sharp focus, traditional indian wear",
        "emojis": "👑🌟",
        "caption": "Regal lines. Modern ease. The Aurum Sherwani — crafted for celebrations that matter.",
        "colors": ["cream", "maroon", "gold"],
        "style": "traditional_indian"
    },
    "Kurta Pathani": {
        "prompt": "stylish indian male model, wearing kurta pathani, traditional indian wear, comfort, high quality, detailed, natural lighting, fashion photography, 9:16 aspect ratio, sharp focus, traditional clothing",
        "emojis": "🧵🌿",
        "caption": "Classic comfort with tailored sharpness — Kurta Pathani by Aurum Bespoke.",
        "colors": ["black", "white", "olive"],
        "style": "traditional_casual"
    },
    "Bandgala": {
        "prompt": "distinguished indian male model, wearing bandgala, structured jacket, luxury, high quality, detailed, elegant lighting, fashion photography, 9:16 aspect ratio, sharp focus, traditional indian formal wear",
        "emojis": "🥇🔥",
        "caption": "Bandgala by Aurum — structured, stately, and unmistakably elegant.",
        "colors": ["white", "black", "royal blue"],
        "style": "traditional_formal"
    },
    "Tailored Shirt": {
        "prompt": "refined indian male model, wearing tailored shirt, business casual, luxury, high quality, detailed, professional lighting, fashion photography, 9:16 aspect ratio, sharp focus, business portrait",
        "emojis": "👔✨",
        "caption": "Subtle details. Impeccable fit. The Aurum Tailored Shirt elevates every day.",
        "colors": ["white", "sky blue", "charcoal"],
        "style": "business_casual"
    },
    "Modi Jacket": {
        "prompt": "elegant indian male model, wearing modi jacket, sleeveless, traditional, luxury, high quality, detailed, warm lighting, fashion photography, 9:16 aspect ratio, sharp focus, traditional indian jacket",
        "emojis": "🇮🇳✨",
        "caption": "Iconic Modi Jacket — timeless, versatile, and tailored to perfection.",
        "colors": ["black", "cream", "rust"],
        "style": "traditional_jacket"
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

def create_realistic_fashion_image(service: str, color_name: str) -> Path:
    """Create a realistic fashion image using advanced composition techniques."""
    # Create base image with sophisticated background
    img = Image.new('RGB', (CANVAS_W, CANVAS_H), BACKGROUND_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Create sophisticated gradient background
    for y in range(CANVAS_H):
        # Create a complex gradient with multiple color stops
        if y < CANVAS_H * 0.3:
            # Top section - dark to medium
            intensity = int(15 + (y / (CANVAS_H * 0.3)) * 25)
        elif y < CANVAS_H * 0.7:
            # Middle section - medium to light
            intensity = int(40 + ((y - CANVAS_H * 0.3) / (CANVAS_H * 0.4)) * 35)
        else:
            # Bottom section - light to dark
            intensity = int(75 - ((y - CANVAS_H * 0.7) / (CANVAS_H * 0.3)) * 35)
        
        color = (intensity, intensity, intensity)
        draw.line([(0, y), (CANVAS_W, y)], fill=color)
    
    # Add subtle texture overlay
    for x in range(0, CANVAS_W, 4):
        for y in range(0, CANVAS_H, 4):
            if random.random() < 0.1:  # 10% chance for texture dots
                intensity = random.randint(-5, 5)
                # Get color from the image, not the draw object
                current_color = img.getpixel((x, y))
                new_color = tuple(max(0, min(255, c + intensity)) for c in current_color)
                draw.point((x, y), fill=new_color)
    
    # Create fashion model silhouette
    center_x = CANVAS_W // 2
    center_y = CANVAS_H // 2 + 50
    
    # Draw sophisticated model outline with realistic proportions
    # Head with better proportions
    head_width = 80
    head_height = 100
    draw.ellipse([center_x - head_width//2, center_y - 250, center_x + head_width//2, center_y - 150], 
                 outline=(201, 158, 103), width=2, fill=(40, 40, 40))
    
    # Neck
    neck_width = 30
    draw.rectangle([center_x - neck_width//2, center_y - 150, center_x + neck_width//2, center_y - 120], 
                   outline=(201, 158, 103), width=2, fill=(35, 35, 35))
    
    # Torso with realistic proportions
    torso_width = 120
    torso_height = 180
    draw.rectangle([center_x - torso_width//2, center_y - 120, center_x + torso_width//2, center_y + 60], 
                   outline=(201, 158, 103), width=2, fill=(45, 45, 45))
    
    # Arms with natural positioning
    # Left arm
    draw.rectangle([center_x - 140, center_y - 100, center_x - 100, center_y + 80], 
                   outline=(201, 158, 103), width=2, fill=(40, 40, 40))
    # Right arm
    draw.rectangle([center_x + 100, center_y - 100, center_x + 140, center_y + 80], 
                   outline=(201, 158, 103), width=2, fill=(40, 40, 40))
    
    # Legs with natural stance
    leg_width = 35
    # Left leg
    draw.rectangle([center_x - 50, center_y + 60, center_x - 15, center_y + 200], 
                   outline=(201, 158, 103), width=2, fill=(40, 40, 40))
    # Right leg
    draw.rectangle([center_x + 15, center_y + 60, center_x + 50, center_y + 200], 
                   outline=(201, 158, 103), width=2, fill=(40, 40, 40))
    
    # Add clothing details based on service
    add_clothing_details(draw, service, center_x, center_y, color_name)
    
    # Add sophisticated lighting effects
    add_lighting_effects(draw, center_x, center_y)
    
    # Add fashion photography elements
    add_fashion_elements(draw, service)
    
    # Add branding and text
    add_branding_elements(draw, service, color_name)
    
    # Apply final enhancements
    img = apply_image_enhancements(img)
    
    # Save the image
    image_path = OUTPUT_DIR / f"{service.lower().replace(' ', '_')}_{int(time.time())}.png"
    img.save(image_path, quality=95)
    
    return image_path

def add_clothing_details(draw: ImageDraw.Draw, service: str, center_x: int, center_y: int, color_name: str):
    """Add specific clothing details for each service."""
    if service == "Suit":
        # Add suit lapels
        draw.polygon([(center_x - 60, center_y - 80), (center_x - 40, center_y - 60), (center_x + 40, center_y - 60), (center_x + 60, center_y - 80)], 
                     outline=(201, 158, 103), width=2, fill=(50, 50, 50))
        # Add tie
        draw.rectangle([center_x - 8, center_y - 100, center_x + 8, center_y - 40], 
                       outline=(201, 158, 103), width=2, fill=(60, 60, 60))
    
    elif service == "Sherwani":
        # Add sherwani details
        draw.rectangle([center_x - 80, center_y - 120, center_x + 80, center_y + 60], 
                       outline=(201, 158, 103), width=3, fill=(45, 45, 45))
        # Add traditional buttons
        for i in range(3):
            y_pos = center_y - 80 + i * 40
            draw.ellipse([center_x - 5, y_pos - 5, center_x + 5, y_pos + 5], 
                         fill=(201, 158, 103))
    
    elif service == "Bandgala":
        # Add bandgala collar
        draw.rectangle([center_x - 60, center_y - 100, center_x + 60, center_y - 80], 
                       outline=(201, 158, 103), width=2, fill=(50, 50, 50))
        # Add traditional closure
        draw.rectangle([center_x - 20, center_y - 80, center_x + 20, center_y - 40], 
                       outline=(201, 158, 103), width=2, fill=(55, 55, 55))

def add_lighting_effects(draw: ImageDraw.Draw, center_x: int, center_y: int):
    """Add sophisticated lighting effects."""
    # Main light source from top-left
    for i in range(50):
        alpha = int(255 * (1 - i/50) * 0.3)
        color = (255, 255, 255, alpha)
        # Create radial light effect
        radius = i * 8
        draw.ellipse([center_x - radius, center_y - 200 - radius, center_x + radius, center_y - 200 + radius], 
                     fill=color, outline=None)
    
    # Secondary rim lighting
    for i in range(30):
        alpha = int(255 * (1 - i/30) * 0.2)
        color = (201, 158, 103, alpha)
        # Right side rim light
        draw.ellipse([center_x + 100 - i*3, center_y - 150 - i*2, center_x + 100 + i*3, center_y - 150 + i*2], 
                     fill=color, outline=None)

def add_fashion_elements(draw: ImageDraw.Draw, service: str):
    """Add fashion photography elements."""
    # Add subtle grid lines for fashion photography feel
    for i in range(0, CANVAS_W, 100):
        alpha = 30
        color = (201, 158, 103, alpha)
        draw.line([(i, 0), (i, CANVAS_H)], fill=color, width=1)
    
    for i in range(0, CANVAS_H, 100):
        alpha = 30
        color = (201, 158, 103, alpha)
        draw.line([(0, i), (CANVAS_W, i)], fill=color, width=1)
    
    # Add fashion magazine style corner elements
    corner_size = 60
    # Top-left corner
    draw.rectangle([0, 0, corner_size, corner_size], outline=(201, 158, 103), width=2, fill=None)
    # Top-right corner
    draw.rectangle([CANVAS_W - corner_size, 0, CANVAS_W, corner_size], outline=(201, 158, 103), width=2, fill=None)
    # Bottom-left corner
    draw.rectangle([0, CANVAS_H - corner_size, corner_size, CANVAS_H], outline=(201, 158, 103), width=2, fill=None)
    # Bottom-right corner
    draw.rectangle([CANVAS_W - corner_size, CANVAS_H - corner_size, CANVAS_W, CANVAS_H], outline=(201, 158, 103), width=2, fill=None)

def add_branding_elements(draw: ImageDraw.Draw, service: str, color_name: str):
    """Add branding and text elements."""
    try:
        # Try to use a default font, fallback to basic if not available
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
        font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 32)
    except:
        try:
            font_large = ImageFont.load_default()
            font_medium = ImageFont.load_default()
            font_small = ImageFont.load_default()
        except:
            font_large = None
            font_medium = None
            font_small = None
    
    # Top branding bar
    draw.rectangle([0, 0, CANVAS_W, 120], fill=(201, 158, 103))
    
    # Service name with shadow
    service_text = f"Aurum Bespoke"
    if font_large:
        # Shadow effect
        draw.text((CANVAS_W//2 + 4, 30 + 4), service_text, fill=(0, 0, 0), font=font_large)
        # Main text
        bbox = draw.textbbox((0, 0), service_text, font=font_large)
        text_width = bbox[2] - bbox[0]
        x = (CANVAS_W - text_width) // 2
        draw.text((x, 30), service_text, fill=(255, 255, 255), font=font_large)
    
    # Service type
    service_type = service
    if font_large:
        # Shadow effect
        draw.text((CANVAS_W//2 + 4, 100 + 4), service_type, fill=(0, 0, 0), font=font_large)
        # Main text
        bbox = draw.textbbox((0, 0), service_type, font=font_large)
        text_width = bbox[2] - bbox[0]
        x = (CANVAS_W - text_width) // 2
        draw.text((x, 100), service_type, fill=(255, 255, 255), font=font_large)
    
    # Bottom branding bar
    draw.rectangle([0, CANVAS_H - 120, CANVAS_W, CANVAS_H], fill=(201, 158, 103))
    
    # Bottom text
    bottom_text = f"Color: {color_name.title()} • Professional Tailoring • Luxury Menswear"
    if font_small:
        bbox = draw.textbbox((0, 0), bottom_text, font=font_small)
        text_width = bbox[2] - bbox[0]
        x = (CANVAS_W - text_width) // 2
        y = CANVAS_H - 80
        draw.text((x, y), bottom_text, fill=(0, 0, 0), font=font_small)

def apply_image_enhancements(img: Image.Image) -> Image.Image:
    """Apply final image enhancements."""
    # Enhance contrast slightly
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.1)
    
    # Enhance sharpness
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(1.2)
    
    # Add subtle vignette effect
    width, height = img.size
    center_x, center_y = width // 2, height // 2
    max_distance = ((width // 2) ** 2 + (height // 2) ** 2) ** 0.5
    
    # Create vignette mask
    vignette = Image.new('L', (width, height), 255)
    draw = ImageDraw.Draw(vignette)
    
    for y in range(height):
        for x in range(width):
            distance = ((x - center_x) ** 2 + (y - center_y) ** 2) ** 0.5
            if distance > max_distance * 0.3:
                # Apply vignette effect
                factor = 1 - (distance - max_distance * 0.3) / (max_distance * 0.7)
                factor = max(0.3, factor)  # Don't go below 30% brightness
                pixel_value = int(255 * factor)
                draw.point((x, y), fill=pixel_value)
    
    # Apply vignette
    img.putalpha(vignette)
    
    return img

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
        
        print(f"Generating realistic fashion image for {service}...")
        image_path = create_realistic_fashion_image(service, color_name)
        
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
            
            print(f"Sent realistic fashion image post {next_slno:03d} for service: {service}")
        else:
            print("Failed to generate image")
            return 1
    
    # For now, skip video generation until we have a working solution
    # This will be implemented later with proper video generation
    
    save_state(state)
    return 0

if __name__ == "__main__":
    sys.exit(main())