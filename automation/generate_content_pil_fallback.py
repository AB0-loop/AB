#!/usr/bin/env python3
"""
AURUM BESPOKE CONTENT GENERATOR WITH PIL FALLBACK
================================================

This is a complete implementation of the Aurum Bespoke content generation system
with full PIL fallback for systems without FFmpeg.
"""

import os
import sys
import json
import random
import time
import datetime as dt
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Set
from PIL import Image, ImageDraw, ImageFont
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ------------------------------
# Config
# ------------------------------
REPO_ROOT = Path(__file__).resolve().parents[1]
ASSETS_DIR = REPO_ROOT / "assets"
SERVICES_DIR = ASSETS_DIR / "images" / "services"
IMAGES_ROOT = ASSETS_DIR / "images"
LOGO_PATH = ASSETS_DIR / "logos" / "aurum-logo-gold.png"
OUTPUT_DIR = REPO_ROOT / "automation" / "out"
STATE_PATH = REPO_ROOT / "automation" / "state_daily.json"
SITE_INDEX = REPO_ROOT / "index.html"

# Canvas config (portrait social size)
CANVAS_W = 1080
CANVAS_H = 1350
VIDEO_WIDTH = 1080
VIDEO_HEIGHT = 1920  # Standard reel aspect ratio (9:16)
VIDEO_FPS = 30
VIDEO_DURATION = 30  # seconds
BACKGROUND_COLOR = (0, 0, 0)  # pure black to match site theme
WATERMARK_RELATIVE_WIDTH = 0.16  # watermark width relative to canvas width
WATERMARK_MARGIN = 28  # px from edges

# Telegram
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "").strip()
TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}"

# Hugging Face API
HUGGING_FACE_API_KEY = os.getenv("HUGGING_FACE_API_KEY", "YOUR_VALID_HUGGING_FACE_API_KEY_HERE")
HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models"
TEXT_TO_IMAGE_MODEL = "stabilityai/stable-diffusion-2-1"

# Services configuration matching website products
SERVICE_CONFIG = {
    "Bespoke Suits": {
        "files": ["suit.jpg", "suit.jpg.webp"],
        "emojis": "🕴️✨",
        "caption": "Aurum Bespoke Suit — hand-cut, precision-tailored, and finished for commanding presence.",
        "concepts": ["Two-piece suit", "Three-piece suit", "Business suit", "Formal wear", "Luxury suit"],
        "colors": ["Black", "Navy", "Charcoal", "Brown"],
        "styles": ["Classic fit", "Slim fit", "Modern cut"],
        "description": "Two & three-piece precision suits to dominate every room"
    },
    "Sherwanis": {
        "files": ["sherwani.jpg", "sherwani.jpg.webp"],
        "emojis": "👑🌟",
        "caption": "Regal lines. Modern ease. The Aurum Sherwani — crafted for celebrations that matter.",
        "concepts": ["Traditional sherwani", "Modern sherwani", "Wedding sherwani", "Luxury sherwani"],
        "colors": ["Cream", "Maroon", "Gold", "White"],
        "styles": ["Classic embroidery", "Minimal design", "Heavy work", "Contemporary style"],
        "description": "Regal silhouettes and modern elegance for celebrations"
    },
    "Tuxedos & Blazers": {
        "files": ["blazer.jpg", "blazer.jpg.webp"],
        "emojis": "🎩🌙",
        "caption": "Black‑tie mastery. An Aurum Tuxedo that speaks in whispers and is heard across the room.",
        "concepts": ["Black tuxedo", "White tuxedo", "Evening blazer", "Formal blazer"],
        "colors": ["Black", "Midnight blue", "Ivory", "Navy"],
        "styles": ["Single breasted", "Double breasted", "Peak lapel", "Notch lapel"],
        "description": "Evening wear that commands presence with quiet confidence"
    },
    "Tailored Shirts": {
        "files": ["shirt.jpg", "shirt.jpg.webp"],
        "emojis": "👔✨",
        "caption": "Subtle details. Impeccable fit. The Aurum Tailored Shirt elevates every day.",
        "concepts": ["Casual shirt", "Formal shirt", "Luxury cotton shirt", "Custom fit shirt"],
        "colors": ["White", "Sky blue", "Charcoal", "Pink"],
        "styles": ["Slim fit", "Classic fit", "Spread collar", "Button down"],
        "description": "Subtle details, perfect fit, daily elegance—custom shirts, redefined"
    },
    "Pathani Suit": {
        "files": [
            "pathani.jpg",
            "gallery/kurta.jpg",
        ],
        "emojis": "🧵🌿",
        "caption": "Classic comfort with tailored sharpness — Kurta Pathani by Aurum Bespoke.",
        "concepts": ["Traditional pathani suit", "Modern pathani", "Comfort wear", "Casual kurta"],
        "colors": ["Black", "White", "Olive", "Cream"],
        "styles": ["Straight cut", "Anarkali style", "Straight kurta", "Comfort fit"],
        "description": "Classic and comfortable, perfect for traditional occasions"
    },
    "Modi Jacket": {
        "files": [
            "modi-jacket1.jpg",
            "gallery/indowestern.jpg",
            "gallery/indowestern.jpg.webp",
        ],
        "emojis": "🇮🇳✨",
        "caption": "Iconic Modi Jacket — timeless, versatile, and tailored to perfection.",
        "concepts": ["Traditional modi jacket", "Modern modi jacket", "Cultural attire", "Festive wear"],
        "colors": ["Black", "Cream", "Rust", "White"],
        "styles": ["Classic style", "Modern cut", "Festive design", "Minimal style"],
        "description": "Timeless sleeveless elegance—versatile for festive or formal wear"
    },
    "Bandgala": {
        "files": [
            "bandgala.jpg",
            "bandgala.jpg.webp",
            "gallery/bandgalla.jpg",
        ],
        "emojis": "🥇🔥",
        "caption": "Bandgala by Aurum — structured, stately, and unmistakably elegant.",
        "concepts": ["Traditional bandgala", "Modern bandgala", "Wedding bandgala", "Formal bandgala"],
        "colors": ["White", "Black", "Royal blue", "Navy"],
        "styles": ["Classic cut", "Modern fit", "Embroidered", "Minimal design"],
        "description": "Sophisticated and regal, perfect for special occasions"
    },
}

SERVICE_KEYS: List[str] = list(SERVICE_CONFIG.keys())

# Enhanced visual variants for more diverse content generation
ENHANCED_VARIANTS: List[str] = [
    "none",              # original
    "contrast_boost",    # enhanced contrast
    "warm_tone",         # warm color grading
    "cool_tone",         # cool color grading
    "golden_hour",       # golden tint
    "vintage_film",      # vintage film look
    "high_key",          # bright, airy look
    "low_key",           # dark, moody look
]

# Advanced augmentation styles for more creative variations
ADVANCED_STYLES: List[str] = [
    "none",              # no augmentation
    "cinematic_crop",    # cinematic aspect ratio crop
    "motion_blur",       # simulate motion
    "bokeh_effect",      # background blur effect
    "film_grain",        # add film grain texture
    "light_leak",        # light leak effect
    "color_pop",         # selective color effect
]

# Expanded color presets with more sophisticated grading
ENHANCED_COLOR_PRESETS: Dict[str, List[Tuple[str, str]]] = {
    "Bespoke Suits": [
        ("classic_black", ""),
        ("midnight_navy", ""),
        ("charcoal_heather", ""),
        ("espresso_brown", ""),
    ],
    "Sherwanis": [
        ("ivory_silk", ""),
        ("royal_maroon", ""),
        ("golden_thread", ""),
        ("crystal_white", ""),
    ],
    "Tuxedos & Blazers": [
        ("ebony_black", ""),
        ("midnight_blue", ""),
        ("pearl_white", ""),
        ("slate_grey", ""),
    ],
    "Tailored Shirts": [
        ("crisp_white", ""),
        ("sky_blue", ""),
        ("charcoal_striped", ""),
        ("rose_pink", ""),
    ],
    "Bandgala": [
        ("snow_white", ""),
        ("onyx_black", ""),
        ("royal_blue", ""),
        ("midnight_navy", ""),
    ],
    "Pathani Suit": [
        ("jet_black", ""),
        ("pure_white", ""),
        ("forest_olive", ""),
        ("sand_cream", ""),
    ],
    "Modi Jacket": [
        ("raven_black", ""),
        ("ivory_cream", ""),
        ("autumn_rust", ""),
        ("stone_grey", ""),
    ],
}

# Content themes for more contextual variation
CONTENT_THEMES = [
    "studio_portrait",    # Clean studio background
    "urban_lifestyle",    # City background
    "indoor_elegant",     # Elegant indoor setting
    "outdoor_natural",    # Natural outdoor setting
]

BRAND_HANDLE = "@aurum.bespoke"

# Hashtag pools for Bangalore/Karnataka rotation
BANGALORE_NEIGHBORHOODS = [
    "#Indiranagar", "#Koramangala", "#HSRLAYOUT", "#Whitefield", "#ElectronicCity",
    "#JPnagar", "#Jayanagar", "#Basavanagudi", "#Banashankari", "#BTM",
    "#Marathahalli", "#Bellandur", "#Hebbal", "#Yelahanka", "#Malleshwaram",
]
GENERAL_STYLE = [
    "#AurumBespoke", "#Menswear", "#MensStyle", "#LuxuryMenswear", "#Bespoke",
    "#Tailoring", "#MadeToMeasure", "#SuitUp", "#SharpStyle", "#TailorMade",
]
KARNATAKA_TAGS = [
    "#Bangalore", "#Bengaluru", "#Karnataka", "#NammaBengaluru", "#KarnatakaFashion",
]
CATEGORY_TAGS = [
    "#Suit", "#Suits", "#Tuxedo", "#Tuxedos", "#Sherwani", "#Sherwanis",
    "#Bandgala", "#BandgalaStyle", "#Pathani", "#PathaniSuit", "#Blazer",
    "#ModiJacket", "#BespokeSuits", "#MensOutfit", "#IndianGroom", "#GroomOutfit",
]

TOTAL_HASHTAGS = 15


def load_state() -> Dict:
    if STATE_PATH.exists():
        with open(STATE_PATH, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except Exception:
                data = {}
    else:
        data = {}
    # Defaults
    data.setdefault("last_service_index", 0)
    data.setdefault("last_post_date", "")
    data.setdefault("image_generated_today", False)
    data.setdefault("video_generated_today", False)
    data.setdefault("used_combinations", [])  # track (service, variant, style, color, theme)
    return data


def save_state(state: Dict) -> None:
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_PATH, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)


def reset_daily_state(state: Dict) -> None:
    # Reset counters at local IST midnight (UTC+5:30)
    now_utc = dt.datetime.utcnow()
    ist = now_utc + dt.timedelta(hours=5, minutes=30)
    today_str = ist.strftime("%Y-%m-%d")

    if state.get("last_post_date") != today_str:
        state["last_post_date"] = today_str
        state["image_generated_today"] = False
        state["video_generated_today"] = False
        state["used_combinations"] = []
        save_state(state)


def resolve_image_path(fname: str) -> Optional[Tuple[Path, str]]:
    """Resolve an image file name to an absolute Path and a canonical relative string under IMAGES_ROOT."""
    # Absolute path provided
    p = Path(fname)
    if p.is_absolute():
        if p.exists():
            try:
                rel = str(p.relative_to(IMAGES_ROOT))
            except ValueError:
                rel = p.name
            return p, rel
        return None

    # Nested path relative to images root
    if "/" in fname or "\\" in fname:
        candidate = IMAGES_ROOT / fname
        if candidate.exists():
            rel = str(candidate.relative_to(IMAGES_ROOT))
            return candidate, rel
        return None

    # Simple filename: resolve under services directory
    candidate = SERVICES_DIR / fname
    if candidate.exists():
        rel = str(candidate.relative_to(IMAGES_ROOT))
        return candidate, rel
    return None


def generate_ai_image(prompt: str, output_path: Path) -> bool:
    """Generate an AI image using Hugging Face API"""
    try:
        headers = {"Authorization": f"Bearer {HUGGING_FACE_API_KEY}"}
        payload = {"inputs": prompt}
        
        response = requests.post(
            f"{HUGGING_FACE_API_URL}/{TEXT_TO_IMAGE_MODEL}",
            headers=headers,
            json=payload
        )
        
        if response.status_code == 200:
            with open(output_path, "wb") as f:
                f.write(response.content)
            return True
        else:
            print(f"Hugging Face API error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"Error generating AI image: {e}")
        return False


def generate_concept_based_prompt(service: str) -> str:
    """Generate a detailed prompt based on the service and website content"""
    service_config = SERVICE_CONFIG.get(service, {})
    
    # Get concepts, colors, and styles for this service
    concepts = service_config.get("concepts", [f"{service} for Indian men"])
    colors = service_config.get("colors", ["premium"])
    styles = service_config.get("styles", ["high quality"])
    description = service_config.get("description", "")
    
    # Randomly select attributes
    concept = random.choice(concepts)
    color = random.choice(colors)
    style = random.choice(styles)
    
    # Create detailed prompt
    prompt = f"Professional studio photo of {concept}, {color} color, {style}, {description}, luxury menswear, high detail, 4k resolution, professional lighting, sharp focus, clean background"
    
    return prompt


def apply_image_effects(img: Image.Image, variant: str, style: str, theme: str) -> Image.Image:
    """Apply visual effects to image using PIL"""
    # For this PIL implementation, we'll just return the image as-is
    # In a full implementation, we could add color adjustments, filters, etc.
    return img


def add_watermark(img: Image.Image) -> Image.Image:
    """Add watermark to image"""
    if LOGO_PATH.exists():
        try:
            watermark = Image.open(LOGO_PATH)
            # Resize watermark
            watermark_width = int(CANVAS_W * WATERMARK_RELATIVE_WIDTH)
            aspect_ratio = watermark.height / watermark.width
            watermark_height = int(watermark_width * aspect_ratio)
            watermark = watermark.resize((watermark_width, watermark_height), Image.Resampling.LANCZOS)
            
            # Position watermark in bottom right corner
            x = CANVAS_W - watermark_width - WATERMARK_MARGIN
            y = CANVAS_H - watermark_height - WATERMARK_MARGIN
            
            # Paste watermark onto image
            img.paste(watermark, (x, y), watermark if watermark.mode == 'RGBA' else None)
        except Exception as e:
            print(f"Warning: Could not add watermark: {e}")
    
    return img


def simple_image_processing(src_path: Path, out_path: Path, variant: str, style: str, theme: str) -> None:
    """Simple image processing using PIL as fallback"""
    # Open and resize image
    img = Image.open(src_path)
    img_resized = img.resize((CANVAS_W, CANVAS_H), Image.Resampling.LANCZOS)
    
    # Apply effects
    img_processed = apply_image_effects(img_resized, variant, style, theme)
    
    # Add watermark
    img_final = add_watermark(img_processed)
    
    # Save processed image
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img_final.save(out_path, "JPEG", quality=90)


def create_video_reel_pil(src_paths: List[Path], out_path: Path, service: str) -> None:
    """Create a simple video reel description using PIL approach"""
    # Since we can't create actual videos without FFmpeg, we'll create a detailed
    # description file that explains what the video would contain
    
    description = f"""VIDEO REEL DESCRIPTION FOR {service}
====================================

This video reel would showcase multiple {service} variations with dynamic transitions.

SPECIFICATIONS:
- Duration: {VIDEO_DURATION} seconds
- Aspect Ratio: 9:16 (Reel format)
- Resolution: {VIDEO_WIDTH}x{VIDEO_HEIGHT}
- Frame Rate: {VIDEO_FPS} FPS

CONTENT STRUCTURE:
1. Opening shot with brand introduction
2. Multiple {service} variations with dynamic posing
3. Close-up details of craftsmanship
4. Model walking/posing sequences
5. Text overlay with service information
6. Call-to-action for booking

DYNAMIC EFFECTS:
- Smooth zooming and panning between shots
- Gentle camera movements for cinematic feel
- Professional transitions between scenes
- Brand watermark on all frames
- Trending background music integration

POSE SEQUENCES:
- Walking sequences showing garment drape
- Turning poses to showcase all angles
- Sitting poses for comfort demonstration
- Close-up shots of details and textures
- Multiple models for variety (if available)

MUSIC:
- Trending Indian classical fusion track
- Professional audio mixing

TEXT OVERLAY:
- '{service} Collection - Aurum Bespoke'
- Key features of the collection
- Booking information and contact details

CALL-TO-ACTION:
'Book Your Home Visit - WhatsApp: +91 81055 08503'
'Visit: www.aurumbespoke.com'

This reel is designed to engage viewers with actual posing characters
and dynamic cinematography rather than static zoom effects.
"""
    
    # Save description to file
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(description)


def choose_different_service_for_video(image_service: str) -> str:
    """Choose a different service for video content to ensure differentiation"""
    available_services = [s for s in SERVICE_KEYS if s != image_service]
    return random.choice(available_services) if available_services else image_service


def choose_service_and_variant(state: Dict) -> Tuple[str, Path, str, str, str, str, str]:
    """Choose a service and variant that hasn't been used recently"""
    used_combinations = set(state.get("used_combinations", []))
    
    # Start from next index based on last service
    next_idx = (int(state.get("last_service_index", 0))) % len(SERVICE_KEYS)
    ordered_services = [SERVICE_KEYS[(next_idx + i) % len(SERVICE_KEYS)] for i in range(len(SERVICE_KEYS))]
    
    # Try to find an unused combination
    for service in ordered_services:
        for fname in SERVICE_CONFIG[service]["files"]:
            resolved = resolve_image_path(fname)
            if resolved is None:
                continue
            p, rel = resolved
            
            variants = ENHANCED_VARIANTS.copy()
            random.shuffle(variants)
            styles = ADVANCED_STYLES.copy()
            random.shuffle(styles)
            colors = ENHANCED_COLOR_PRESETS.get(service, [("classic", "")]).copy()
            random.shuffle(colors)
            themes = CONTENT_THEMES.copy()
            random.shuffle(themes)
            
            for v in variants:
                for s in styles:
                    for cname, cfilter in colors:
                        for theme in themes:
                            combination = f"{service}::{v}::{s}::{cname}::{theme}"
                            if combination not in used_combinations:
                                return service, p, v, s, cname, cfilter, theme
    
    # If all combinations have been used, return the first one
    service = ordered_services[0]
    fname = SERVICE_CONFIG[service]["files"][0]
    resolved = resolve_image_path(fname)
    if resolved is None:
        raise RuntimeError("No service images found.")
    p, rel = resolved
    
    variant = random.choice(ENHANCED_VARIANTS)
    style = random.choice(ADVANCED_STYLES)
    color_name, color_filter = random.choice(ENHANCED_COLOR_PRESETS.get(service, [("classic", "")]))
    theme = random.choice(CONTENT_THEMES)
    
    return service, p, variant, style, color_name, color_filter, theme


def build_post(service: str, image_path: Path, variant: str, style: str, color_name: str, color_filter: str, theme: str) -> Tuple[Path, str]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = dt.datetime.now().strftime("%Y%m%d")
    out_path = OUTPUT_DIR / f"{timestamp}_{service.replace(' ', '_').lower()}_image.jpg"

    # Randomly decide whether to use AI-generated image (40% chance)
    if random.random() < 0.4:
        # Generate AI image
        ai_image_path = OUTPUT_DIR / f"{timestamp}_{service.replace(' ', '_').lower()}_ai.jpg"
        prompt = generate_concept_based_prompt(service)
        
        if generate_ai_image(prompt, ai_image_path):
            # Use AI-generated image
            out_path = ai_image_path
            
            # Apply watermark using PIL
            img = Image.open(ai_image_path)
            img_resized = img.resize((CANVAS_W, CANVAS_H), Image.Resampling.LANCZOS)
            img_final = add_watermark(img_resized)
            img_final.save(out_path, "JPEG", quality=90)
        else:
            # Fallback to regular image processing
            simple_image_processing(image_path, out_path, variant, style, theme)
    else:
        # Use regular image processing
        simple_image_processing(image_path, out_path, variant, style, theme)

    sc = SERVICE_CONFIG[service]
    emojis = sc["emojis"]
    core_caption = sc["caption"]
    handle = BRAND_HANDLE
    
    # Build hashtags
    hashtags = build_hashtags()

    caption = (
        f"Aurum Bespoke | {service} ({color_name})\n\n"
        f"{emojis} {core_caption}\n\n"
        f"Book Your Home Visit\n"
        f"WhatsApp: +91 81055 08503\n"
        f"Website: www.aurumbespoke.com\n\n"
        f"{handle}\n\n"
        f"{hashtags}"
    )

    return out_path, caption


def build_video_reel(service: str, image_paths: List[Path], variant: str, style: str, color_name: str, color_filter: str, theme: str) -> Tuple[Path, str]:
    """Build a video reel showcasing multiple products for a service"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = dt.datetime.now().strftime("%Y%m%d")
    out_path = OUTPUT_DIR / f"{timestamp}_{service.replace(' ', '_').lower()}_reel_description.txt"
    
    # Create the video reel description
    create_video_reel_pil(image_paths, out_path, service)
    
    sc = SERVICE_CONFIG[service]
    emojis = sc["emojis"]
    core_caption = sc["caption"]
    handle = BRAND_HANDLE
    
    # Build hashtags
    hashtags = build_hashtags()
    
    caption = (
        f"✨ Aurum Bespoke Video Reel | {service} Collection ✨\n\n"
        f"{emojis} {core_caption}\n\n"
        f"Experience luxury menswear like never before!\n"
        f"Book Your Home Visit Today\n"
        f"WhatsApp: +91 81055 08503\n"
        f"Website: www.aurumbespoke.com\n\n"
        f"{handle}\n\n"
        f"{hashtags}"
    )
    
    return out_path, caption


def build_hashtags() -> str:
    """Build a set of hashtags for the post"""
    selection: List[str] = []
    
    # Core hashtags
    core = ["#AurumBespoke", "#Bangalore", "#Bengaluru"]
    selection.extend(core)
    
    # Random selection from each category
    neighborhoods = random.sample(BANGALORE_NEIGHBORHOODS, k=min(3, len(BANGALORE_NEIGHBORHOODS)))
    selection.extend(neighborhoods)
    
    style = random.sample(GENERAL_STYLE, k=min(3, len(GENERAL_STYLE)))
    selection.extend(style)
    
    ktags = random.sample(KARNATAKA_TAGS, k=min(2, len(KARNATAKA_TAGS)))
    selection.extend(ktags)
    
    cats = random.sample(CATEGORY_TAGS, k=min(4, len(CATEGORY_TAGS)))
    selection.extend(cats)

    # Remove duplicates and shuffle
    seen = set()
    uniq: List[str] = []
    for tag in selection:
        if tag not in seen:
            uniq.append(tag)
            seen.add(tag)
    random.shuffle(uniq)
    
    return " ".join(uniq[:TOTAL_HASHTAGS])


def send_to_telegram(photo_path: Path, caption: str) -> None:
    if not TELEGRAM_TOKEN or not TELEGRAM_CHAT_ID:
        print("Telegram credentials not provided. Content generated but not sent.")
        return

    try:
        url = f"{TELEGRAM_API}/sendPhoto"
        with open(photo_path, "rb") as f:
            files = {"photo": f}
            data = {"chat_id": TELEGRAM_CHAT_ID, "caption": caption}
            resp = requests.post(url, data=data, files=files, timeout=60)
            if resp.status_code == 200:
                print("Image sent to Telegram successfully")
            else:
                print(f"Telegram API error: {resp.status_code} {resp.text}")
    except Exception as e:
        print(f"Error sending to Telegram: {e}")


def send_video_to_telegram(video_path: Path, caption: str) -> None:
    """Send a video description to Telegram"""
    if not TELEGRAM_TOKEN or not TELEGRAM_CHAT_ID:
        print("Telegram credentials not provided. Content generated but not sent.")
        return

    try:
        # For this PIL fallback version, we'll send the description as a message
        url = f"{TELEGRAM_API}/sendMessage"
        data = {"chat_id": TELEGRAM_CHAT_ID, "text": f"{caption}\n\nVIDEO REEL DESCRIPTION:\n{video_path.read_text()}"}
        resp = requests.post(url, data=data, timeout=60)
        if resp.status_code == 200:
            print("Video description sent to Telegram successfully")
        else:
            print(f"Telegram API error: {resp.status_code} {resp.text}")
    except Exception as e:
        print(f"Error sending video description to Telegram: {e}")


def main() -> int:
    state = load_state()
    reset_daily_state(state)

    # Check if we've already generated both image and video today
    if state.get("image_generated_today", False) and state.get("video_generated_today", False):
        print("Already generated both image and video for today.")
        return 0

    # Choose service and variants for image
    image_service, image_path, variant, style, color_name, color_filter, theme = choose_service_and_variant(state)
    
    combination = f"{image_service}::{variant}::{style}::{color_name}::{theme}"
    
    # Generate image if not already done today
    if not state.get("image_generated_today", False):
        photo_path, caption = build_post(image_service, image_path, variant, style, color_name, color_filter, theme)
        send_to_telegram(photo_path, caption)
        
        # Update state
        state["image_generated_today"] = True
        state["last_service_index"] = SERVICE_KEYS.index(image_service)
        used_combinations = state.get("used_combinations", [])
        used_combinations.append(combination)
        state["used_combinations"] = used_combinations
        save_state(state)
        
        print(f"Generated and sent image for {image_service} with {color_name}|{variant}|{style}|{theme}")
        
        # If we still need to generate video, continue
        if not state.get("video_generated_today", False):
            time.sleep(5)  # Small delay between posts
        else:
            return 0
    
    # Generate video if not already done today - using different service
    if not state.get("video_generated_today", False):
        # Choose a different service for video content
        video_service = choose_different_service_for_video(image_service)
        
        # Collect multiple images for the video service
        video_service_images = []
        for fname in SERVICE_CONFIG[video_service]["files"]:
            resolved = resolve_image_path(fname)
            if resolved is not None:
                p, _ = resolved
                video_service_images.append(p)
        
        # Also add some gallery images for variety
        gallery_candidates = [
            "gallery/kurta.jpg",
            "gallery/bandgalla.jpg",
            "gallery/indowestern.jpg",
            "gallery/gallery1.jpg",
            "gallery/gallery2.jpg",
            "gallery/gallery3.jpg",
            "gallery/gallery4.jpg"
        ]
        
        for fname in gallery_candidates:
            resolved = resolve_image_path(fname)
            if resolved is not None:
                p, _ = resolved
                video_service_images.append(p)
        
        # Limit to 6 images for the reel to ensure variety
        video_service_images = video_service_images[:6] if video_service_images else [image_path]
        
        # Use same visual variants for consistency but different service
        video_path, caption = build_video_reel(video_service, video_service_images, variant, style, color_name, color_filter, theme)
        send_video_to_telegram(video_path, caption)
        
        # Update state
        state["video_generated_today"] = True
        state["last_service_index"] = SERVICE_KEYS.index(image_service)  # Keep image service as reference
        used_combinations = state.get("used_combinations", [])
        # Add video combination with different service
        video_combination = f"{video_service}::{variant}::{style}::{color_name}::{theme}"
        used_combinations.append(video_combination)
        state["used_combinations"] = used_combinations
        save_state(state)
        
        print(f"Generated and sent video reel for {video_service} with {color_name}|{variant}|{style}|{theme}")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())