#!/usr/bin/env python3
"""
ZERO COST CONTENT GENERATION FOR AURUM BESPOKE
==============================================

This script provides a completely zero-cost implementation of the content
generation system for Aurum Bespoke, using reduced quality settings and
free cloud processing.

Key Features:
- 720p resolution instead of 1080p
- CPU-based processing without GPU requirements
- Free AI services with intelligent fallbacks
- Optimized for free cloud platforms like Render.com
- Reduced processing time and resource usage
"""

import os
import sys
import json
import random
import time
import datetime as dt
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Set

import requests
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import zero cost configuration
from zero_cost_config import get_zero_cost_config

# ------------------------------
# Zero Cost Config
# ------------------------------
config = get_zero_cost_config()

# Canvas config (reduced for zero cost processing)
CANVAS_W = config["canvas"]["width"]
CANVAS_H = config["canvas"]["height"]
VIDEO_WIDTH = config["canvas"]["video_width"]
VIDEO_HEIGHT = config["canvas"]["video_height"]
VIDEO_FPS = config["canvas"]["fps"]
VIDEO_DURATION = config["canvas"]["duration"]

REPO_ROOT = Path(__file__).resolve().parents[1]
ASSETS_DIR = REPO_ROOT / "assets"
SERVICES_DIR = ASSETS_DIR / "images" / "services"
IMAGES_ROOT = ASSETS_DIR / "images"
LOGO_PATH = ASSETS_DIR / "logos" / "aurum-logo-gold.png"
OUTPUT_DIR = REPO_ROOT / "automation" / "out"
STATE_PATH = REPO_ROOT / "automation" / "state_zero_cost.json"

BACKGROUND_COLOR = (0, 0, 0)  # pure black to match site theme
WATERMARK_RELATIVE_WIDTH = 0.16  # watermark width relative to canvas width
WATERMARK_MARGIN = 20  # px from edges

# Telegram
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "").strip()
TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}"

# Hugging Face API (free tier)
HUGGING_FACE_API_KEY = os.getenv("HUGGING_FACE_API_KEY", "").strip()
HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models"
TEXT_TO_IMAGE_MODEL = "stabilityai/stable-diffusion-2-1"

# Check if API key is provided
HUGGING_FACE_ENABLED = bool(HUGGING_FACE_API_KEY and HUGGING_FACE_API_KEY != "YOUR_VALID_HUGGING_FACE_API_KEY_HERE")

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

# Simplified visual variants for CPU processing
SIMPLIFIED_VARIANTS: List[str] = [
    "none",              # original
    "contrast_boost",    # enhanced contrast
    "warm_tone",         # warm color grading
    "cool_tone",         # cool color grading
    "high_key",          # bright, airy look
    "low_key",           # dark, moody look
]

# Simplified augmentation styles for CPU processing
SIMPLIFIED_STYLES: List[str] = [
    "none",              # no augmentation
    "fade",              # fade effect
    "slide",             # slide transition
    "zoom",              # zoom effect
]

# Simplified color presets for faster processing
SIMPLIFIED_COLOR_PRESETS: Dict[str, List[Tuple[str, str]]] = {
    "Bespoke Suits": [
        ("classic_black", ""),
        ("midnight_navy", ""),
        ("charcoal_heather", ""),
    ],
    "Sherwanis": [
        ("ivory_silk", ""),
        ("royal_maroon", ""),
        ("crystal_white", ""),
    ],
    "Tuxedos & Blazers": [
        ("ebony_black", ""),
        ("midnight_blue", ""),
        ("pearl_white", ""),
    ],
    "Tailored Shirts": [
        ("crisp_white", ""),
        ("sky_blue", ""),
        ("charcoal_striped", ""),
    ],
    "Bandgala": [
        ("snow_white", ""),
        ("onyx_black", ""),
        ("royal_blue", ""),
    ],
    "Pathani Suit": [
        ("jet_black", ""),
        ("pure_white", ""),
        ("forest_olive", ""),
    ],
    "Modi Jacket": [
        ("raven_black", ""),
        ("ivory_cream", ""),
        ("stone_grey", ""),
    ],
}

# Content themes for more contextual variation
CONTENT_THEMES = [
    "studio_portrait",    # Clean studio background
    "indoor_elegant",     # Elegant indoor setting
]

BRAND_HANDLE = "@aurum.bespoke"

# Hashtag pools for Bangalore/Karnataka rotation
BANGALORE_NEHIS = [
    "#Indiranagar", "#Koramangala", "#JPnagar", "#Whitefield",
    "#Jayanagar", "#BTM", "#Marathahalli", "#Malleshwaram",
]
GENERAL_STYLE = [
    "#AurumBespoke", "#Menswear", "#LuxuryMenswear", "#Bespoke",
    "#Tailoring", "#SuitUp", "#TailorMade",
]
KARNATAKA_TAGS = [
    "#Bangalore", "#Bengaluru", "#Karnataka", "#NammaBengaluru",
]
CATEGORY_TAGS = [
    "#Suit", "#Sherwani", "#Bandgala", "#Pathani", "#Blazer",
    "#ModiJacket", "#BespokeSuits", "#MensOutfit",
]

TOTAL_HASHTAGS = 12  # Reduced for zero cost


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
    """Generate an AI image using Hugging Face free tier"""
    # Only try AI generation 5% of the time to conserve quota
    if not HUGGING_FACE_ENABLED or random.random() > 0.05:
        return False
        
    try:
        # Use free tier - no API key needed for basic usage
        headers = {"Authorization": f"Bearer {HUGGING_FACE_API_KEY}"} if HUGGING_FACE_API_KEY else {}
        payload = {
            "inputs": prompt,
            "parameters": {
                "height": CANVAS_H,
                "width": CANVAS_W
            }
        }
        
        response = requests.post(
            f"{HUGGING_FACE_API_URL}/{TEXT_TO_IMAGE_MODEL}",
            headers=headers,
            json=payload,
            timeout=120
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
    
    # Create detailed prompt optimized for free tier
    prompt = f"Professional studio photo of {concept}, {color} color, {style}, {description}, luxury menswear, clean background"
    
    return prompt


def enhance_image_cpu(src_path: Path, out_path: Path, variant: str = "none", style: str = "none") -> None:
    """
    Enhance an image using CPU-based processing for zero cost operation
    """
    try:
        # Open source image
        img = Image.open(src_path).convert('RGB')
        
        # Resize to canvas size with reduced quality settings
        img = img.resize((CANVAS_W, CANVAS_H), Image.Resampling.LANCZOS)
        
        # Apply enhancements based on variant
        if variant == "contrast_boost":
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(1.2)
        elif variant == "warm_tone":
            # Apply warm color balance
            r, g, b = img.split()
            r = ImageEnhance.Brightness(r).enhance(1.1)
            img = Image.merge('RGB', (r, g, b))
        elif variant == "cool_tone":
            # Apply cool color balance
            r, g, b = img.split()
            b = ImageEnhance.Brightness(b).enhance(1.1)
            img = Image.merge('RGB', (r, g, b))
        elif variant == "high_key":
            enhancer = ImageEnhance.Brightness(img)
            img = enhancer.enhance(1.15)
        elif variant == "low_key":
            enhancer = ImageEnhance.Brightness(img)
            img = enhancer.enhance(0.85)
        
        # Apply style effects
        if style == "fade":
            # Apply slight blur for fade effect
            img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
        elif style == "zoom":
            # Crop and resize for zoom effect
            width, height = img.size
            crop_width = int(width * 0.9)
            crop_height = int(height * 0.9)
            left = (width - crop_width) // 2
            top = (height - crop_height) // 2
            right = left + crop_width
            bottom = top + crop_height
            img = img.crop((left, top, right, bottom))
            img = img.resize((width, height), Image.Resampling.LANCZOS)
        
        # Add watermark
        try:
            logo = Image.open(LOGO_PATH).convert('RGBA')
            logo = logo.resize((int(CANVAS_W * WATERMARK_RELATIVE_WIDTH), 
                              int(logo.height * (int(CANVAS_W * WATERMARK_RELATIVE_WIDTH) / logo.width))), 
                             Image.Resampling.LANCZOS)
            
            # Position watermark
            x = CANVAS_W - logo.width - WATERMARK_MARGIN
            y = CANVAS_H - logo.height - WATERMARK_MARGIN
            
            # Paste watermark
            if logo.mode == 'RGBA':
                img.paste(logo, (x, y), logo)
            else:
                img.paste(logo, (x, y))
        except Exception as e:
            print(f"Warning: Could not add watermark: {e}")
        
        # Save with reduced quality for zero cost storage
        img.save(out_path, 'JPEG', quality=config["processing"]["image_quality"])
        print(f"Enhanced image saved to {out_path}")
        
    except Exception as e:
        print(f"Error enhancing image: {e}")
        # Copy original if enhancement fails
        try:
            from shutil import copy2
            copy2(src_path, out_path)
            print(f"Copied original image to {out_path}")
        except Exception as copy_error:
            print(f"Error copying original image: {copy_error}")


def create_video_slideshow_cpu(image_paths: List[Path], output_path: Path) -> bool:
    """
    Create a simple slideshow video using CPU-based processing
    """
    try:
        # Create a simple slideshow with crossfade transitions
        images = []
        for img_path in image_paths[:4]:  # Limit to 4 images for faster processing
            try:
                img = Image.open(img_path).convert('RGB')
                img = img.resize((VIDEO_WIDTH, VIDEO_HEIGHT), Image.Resampling.LANCZOS)
                images.append(img)
            except Exception as e:
                print(f"Warning: Could not load image {img_path}: {e}")
        
        if not images:
            raise ValueError("No valid images found for slideshow generation")
        
        # Create animated GIF as video alternative (zero cost)
        gif_path = output_path.with_suffix('.gif')
        
        # Add watermark to each frame
        frames = []
        for img in images:
            try:
                # Add watermark to each frame
                logo = Image.open(LOGO_PATH).convert('RGBA')
                logo = logo.resize((int(VIDEO_WIDTH * WATERMARK_RELATIVE_WIDTH), 
                                  int(logo.height * (int(VIDEO_WIDTH * WATERMARK_RELATIVE_WIDTH) / logo.width))), 
                                 Image.Resampling.LANCZOS)
                
                # Position watermark
                x = VIDEO_WIDTH - logo.width - WATERMARK_MARGIN
                y = VIDEO_HEIGHT - logo.height - WATERMARK_MARGIN
                
                # Paste watermark
                img_copy = img.copy()
                if logo.mode == 'RGBA':
                    img_copy.paste(logo, (x, y), logo)
                else:
                    img_copy.paste(logo, (x, y))
                
                frames.append(img_copy)
            except Exception as e:
                print(f"Warning: Could not add watermark to frame: {e}")
                frames.append(img)  # Add original image if watermark fails
        
        # Save as animated GIF with longer duration per frame
        frames[0].save(
            gif_path,
            save_all=True,
            append_images=frames[1:],
            duration=2500,  # 2.5 seconds per frame
            loop=0
        )
        print(f"Created animated slideshow GIF at {gif_path}")
        return gif_path
        
    except Exception as e:
        print(f"Error creating video slideshow: {e}")
        return False


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
            
            variants = SIMPLIFIED_VARIANTS.copy()
            random.shuffle(variants)
            styles = SIMPLIFIED_STYLES.copy()
            random.shuffle(styles)
            colors = SIMPLIFIED_COLOR_PRESETS.get(service, [("classic", "")]).copy()
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
    
    variant = random.choice(SIMPLIFIED_VARIANTS)
    style = random.choice(SIMPLIFIED_STYLES)
    color_name, color_filter = random.choice(SIMPLIFIED_COLOR_PRESETS.get(service, [("classic", "")]))
    theme = random.choice(CONTENT_THEMES)
    
    return service, p, variant, style, color_name, color_filter, theme


def build_post(service: str, image_path: Path, variant: str, style: str, color_name: str, color_filter: str, theme: str) -> Tuple[Path, str]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = dt.datetime.now().strftime("%Y%m%d")
    out_path = OUTPUT_DIR / f"{timestamp}_{service.replace(' ', '_').lower()}_image.jpg"

    # Try AI generation (very low probability to conserve quota)
    if HUGGING_FACE_ENABLED and random.random() < 0.05:
        # Generate AI image
        ai_image_path = OUTPUT_DIR / f"{timestamp}_{service.replace(' ', '_').lower()}_ai.jpg"
        prompt = generate_concept_based_prompt(service)
        
        if generate_ai_image(prompt, ai_image_path):
            # Use AI-generated image
            out_path = ai_image_path
            
            # Apply watermark using PIL (CPU-based)
            watermarked_path = OUTPUT_DIR / f"{timestamp}_{service.replace(' ', '_').lower()}_final.jpg"
            enhance_image_cpu(out_path, watermarked_path, "none", "none")
            
            # Use watermarked image as final output
            out_path = watermarked_path
        else:
            # Fallback to regular image processing
            enhance_image_cpu(image_path, out_path, variant, style)
    else:
        # Use regular image processing
        enhance_image_cpu(image_path, out_path, variant, style)

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
    """Build a video reel using CPU-based processing"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = dt.datetime.now().strftime("%Y%m%d")
    
    # Create animated GIF instead of MP4 for zero cost
    out_path = OUTPUT_DIR / f"{timestamp}_{service.replace(' ', '_').lower()}_reel.gif"
    
    # Generate the slideshow with more dynamic transitions
    result = create_video_slideshow_cpu(image_paths, out_path)
    if result:
        out_path = result
    
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
    neighborhoods = random.sample(BANGALORE_NEHIS, k=min(2, len(BANGALORE_NEHIS)))
    selection.extend(neighborhoods)
    
    style = random.sample(GENERAL_STYLE, k=min(2, len(GENERAL_STYLE)))
    selection.extend(style)
    
    ktags = random.sample(KARNATAKA_TAGS, k=min(1, len(KARNATAKA_TAGS)))
    selection.extend(ktags)
    
    cats = random.sample(CATEGORY_TAGS, k=min(3, len(CATEGORY_TAGS)))
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
        raise RuntimeError("TELEGRAM_TOKEN/TELEGRAM_ID not set in environment.")

    url = f"{TELEGRAM_API}/sendPhoto"
    for attempt in range(3):
        try:
            with open(photo_path, "rb") as f:
                files = {"photo": f}
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


def send_video_to_telegram(video_path: Path, caption: str) -> None:
    """Send a video/GIF to Telegram"""
    if not TELEGRAM_TOKEN or not TELEGRAM_CHAT_ID:
        raise RuntimeError("TELEGRAM_TOKEN/TELEGRAM_ID not set in environment.")

    # Check if it's a GIF or MP4
    if video_path.suffix.lower() == '.gif':
        url = f"{TELEGRAM_API}/sendAnimation"
        file_key = "animation"
    else:
        url = f"{TELEGRAM_API}/sendVideo"
        file_key = "video"
        
    for attempt in range(3):
        try:
            with open(video_path, "rb") as f:
                files = {file_key: f}
                data = {"chat_id": TELEGRAM_CHAT_ID, "caption": caption}
                resp = requests.post(url, data=data, files=files, timeout=120)  # Longer timeout for videos
                if resp.status_code == 200:
                    return
                err = f"Telegram API error: {resp.status_code} {resp.text}"
                if attempt == 2:
                    raise RuntimeError(err)
        except Exception as e:
            if attempt == 2:
                raise
        time.sleep(2 ** attempt)


def choose_different_service_for_video(image_service: str) -> str:
    """Choose a different service for video content to ensure differentiation"""
    available_services = [s for s in SERVICE_KEYS if s != image_service]
    return random.choice(available_services) if available_services else image_service


def main() -> int:
    print("=== ZERO COST AURUM BESPOKE CONTENT GENERATION ===")
    print(f"Resolution: {CANVAS_W}x{CANVAS_H} (reduced for zero cost)")
    print(f"Video: {VIDEO_WIDTH}x{VIDEO_HEIGHT}@{VIDEO_FPS}fps, {VIDEO_DURATION}s")
    
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
        print(f"Generating image for {image_service}...")
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
            time.sleep(3)  # Small delay between posts
        else:
            return 0
    
    # Generate video if not already done today - using different service
    if not state.get("video_generated_today", False):
        print("Generating video reel...")
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
        ]
        
        for fname in gallery_candidates:
            resolved = resolve_image_path(fname)
            if resolved is not None:
                p, _ = resolved
                video_service_images.append(p)
        
        # Limit to 4 images for faster processing
        video_service_images = video_service_images[:4] if video_service_images else [image_path]
        
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
        
    print("=== ZERO COST GENERATION COMPLETE ===")
    return 0


if __name__ == "__main__":
    sys.exit(main())