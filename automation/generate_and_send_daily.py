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
from PIL import Image
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
# HUGGING_FACE_API_KEY loaded from .env file
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
        ("classic_black", "eq=contrast=1.15:saturation=0.4:brightness=-0.02"),
        ("midnight_navy", "eq=saturation=1.05,curves=blue='0/0 0.5/0.55 1/1'"),
        ("charcoal_heather", "eq=contrast=1.10:saturation=0.6:brightness=-0.01"),
        ("espresso_brown", "eq=saturation=1.05,colorchannelmixer=rr=1.0:gg=0.92:bb=0.82"),
    ],
    "Sherwanis": [
        ("ivory_silk", "eq=brightness=0.025:saturation=1.02,colorchannelmixer=rr=1.02:gg=1.01:bb=0.99"),
        ("royal_maroon", "curves=red='0/0 0.5/0.65 1/1',eq=saturation=1.02"),
        ("golden_thread", "drawbox=0:0:iw:ih:color=0xc99e67@0.12:t=fill,eq=saturation=1.03"),
        ("crystal_white", "eq=brightness=0.03:saturation=0.95"),
    ],
    "Tuxedos & Blazers": [
        ("ebony_black", "eq=contrast=1.18:saturation=0.35:brightness=-0.025"),
        ("midnight_blue", "eq=saturation=1.04,curves=blue='0/0 0.5/0.58 1/1'"),
        ("pearl_white", "eq=brightness=0.02:saturation=0.92,curves=red='0/0 0.5/0.52 1/1'"),
        ("slate_grey", "eq=contrast=1.12:saturation=0.65:brightness=-0.01"),
    ],
    "Tailored Shirts": [
        ("crisp_white", "eq=brightness=0.03:saturation=0.92"),
        ("sky_blue", "curves=blue='0/0 0.5/0.58 1/1'"),
        ("charcoal_striped", "eq=contrast=1.08:saturation=0.55"),
        ("rose_pink", "colorchannelmixer=rr=1.05:gg=0.9:bb=0.95,eq=saturation=1.03"),
    ],
    "Bandgala": [
        ("snow_white", "eq=brightness=0.03:saturation=0.9"),
        ("onyx_black", "eq=contrast=1.15:saturation=0.4:brightness=-0.02"),
        ("royal_blue", "curves=blue='0/0 0.5/0.62 1/1',eq=saturation=1.04"),
        ("midnight_navy", "eq=saturation=1.03,curves=blue='0/0 0.5/0.55 1/1'"),
    ],
    "Pathani Suit": [
        ("jet_black", "eq=contrast=1.12:saturation=0.42:brightness=-0.02"),
        ("pure_white", "eq=brightness=0.025:saturation=0.92"),
        ("forest_olive", "colorchannelmixer=rr=0.95:gg=1.05:bb=0.9,eq=saturation=1.03"),
        ("sand_cream", "eq=brightness=0.015:saturation=1.02,colorchannelmixer=rr=1.01:gg=1.01:bb=0.97"),
    ],
    "Modi Jacket": [
        ("raven_black", "eq=contrast=1.13:saturation=0.4:brightness=-0.02"),
        ("ivory_cream", "eq=brightness=0.022:saturation=0.93"),
        ("autumn_rust", "colorchannelmixer=rr=1.05:gg=0.95:bb=0.9,eq=saturation=1.04"),
        ("stone_grey", "eq=contrast=1.07:saturation=0.65:brightness=-0.005"),
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
    # If Hugging Face is not enabled, return False immediately
    if not HUGGING_FACE_ENABLED:
        print("Hugging Face API not enabled - skipping AI image generation")
        return False
        
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


def build_ffmpeg_filter(variant: str, style: str, wm_w: int, color_filter: str, theme: str = "studio_portrait") -> Tuple[str, str]:
    """Return (filter_complex, out_label) for ffmpeg with enhanced variations."""
    lbl_base = "base"
    lbl_proc = "proc"
    lbl_wm = "wm"
    lbl_out = "out"

    # Base: cover fit to 1080x1350 and subtle sharpen
    chain_base = (
        f"[0:v]scale={CANVAS_W}:{CANVAS_H}:force_original_aspect_ratio=increase,"
        f"crop={CANVAS_W}:{CANVAS_H},unsharp=5:5:0.6:5:5:0.0[{lbl_base}]"
    )

    # Enhanced variant adjustments
    variant_filters = {
        "none": "",
        "contrast_boost": "eq=contrast=1.12:brightness=0.02:saturation=1.05",
        "warm_tone": "eq=saturation=1.08, colorbalance=rs=0.05:gs=0.03:bs=-0.02",
        "cool_tone": "eq=saturation=1.05, colorbalance=rs=-0.03:gs=0.01:bs=0.05",
        "golden_hour": "drawbox=0:0:iw:ih:color=0xc99e67@0.08:t=fill, eq=saturation=1.03",
        "vintage_film": "curves=vintage, eq=contrast=1.05:saturation=0.9",
        "high_key": "eq=brightness=0.08:contrast=0.9:saturation=1.1",
        "low_key": "eq=brightness=-0.08:contrast=1.2:saturation=0.9",
    }
    vf = variant_filters.get(variant, "")

    # Advanced augmentation styles
    style_filters = {
        "none": "",
        "cinematic_crop": "crop=iw*0.8:ih*0.9,scale=1080:1350",
        "motion_blur": "tblur=power=0.7",
        "bokeh_effect": "boxblur=2:1,overlay=0:0",
        "film_grain": "noise=alls=20:allf=t+u",
        "light_leak": "drawbox=0:0:iw:ih:color=0xffddaa@0.15:t=fill",
        "color_pop": "hue=s=2",
    }
    sf = style_filters.get(style, "")

    # Theme-based background effects
    theme_filters = {
        "studio_portrait": "",  # Default clean look
        "urban_lifestyle": "vignette=PI/4",
        "indoor_elegant": "eq=gamma=1.1:brightness=0.02",
        "outdoor_natural": "colorbalance=rs=0.02:gs=0.03:bs=0.01",
    }
    tf = theme_filters.get(theme, "")

    # Build processing chain from base -> (theme) -> (style) -> (variant) -> (color)
    procs = []
    if tf:
        procs.append(tf)
    if sf:
        procs.append(sf)
    if vf:
        procs.append(vf)
    if color_filter:
        procs.append(color_filter)
    proc_part = ",".join(procs) if procs else "null"
    chain_proc = f"[{lbl_base}]{proc_part}[{lbl_proc}]"

    # Watermark scale and overlay
    chain_wm = f"[1:v]scale={wm_w}:-1[{lbl_wm}]"
    chain_overlay = (
        f"[{lbl_proc}][{lbl_wm}]overlay=x=main_w-overlay_w-{WATERMARK_MARGIN}:y=main_h-overlay_h-{WATERMARK_MARGIN}[{lbl_out}]"
    )

    filter_complex = ",".join([chain_base, chain_proc, chain_wm, chain_overlay])
    return filter_complex, lbl_out


def run_ffmpeg_build(src_path: Path, out_path: Path, variant: str, style: str, color_filter: str, theme: str = "studio_portrait") -> None:
    try:
        wm_target_w = int(CANVAS_W * WATERMARK_RELATIVE_WIDTH)
        filter_complex, out_label = build_ffmpeg_filter(variant, style, wm_target_w, color_filter, theme)
        cmd = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-i", str(src_path),
            "-i", str(LOGO_PATH),
            "-filter_complex", filter_complex,
            "-map", f"[{out_label}]",
            "-frames:v", "1",
            "-q:v", "3",
            str(out_path),
        ]
        subprocess.run(cmd, check=True)
    except FileNotFoundError:
        # FFmpeg not installed, fall back to PIL
        print("FFmpeg not found, falling back to PIL processing")
        from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
        import numpy as np
        
        # Open source image
        img = Image.open(src_path).convert('RGB')
        
        # Resize to canvas size
        img = img.resize((CANVAS_W, CANVAS_H), Image.Resampling.LANCZOS)
        
        # Apply enhancements based on variant
        if variant == "contrast_boost":
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(1.15)
        elif variant == "warm_tone":
            # Apply warm color balance
            r, g, b = img.split()
            r = ImageEnhance.Brightness(r).enhance(1.05)
            img = Image.merge('RGB', (r, g, b))
        elif variant == "cool_tone":
            # Apply cool color balance
            r, g, b = img.split()
            b = ImageEnhance.Brightness(b).enhance(1.05)
            img = Image.merge('RGB', (r, g, b))
        
        # Apply style effects
        if style == "motion_blur":
            img = img.filter(ImageFilter.GaussianBlur(radius=1))
        elif style == "film_grain":
            # Add noise
            noise = np.random.randint(-10, 10, img.size[::-1] + (3,), dtype=np.int16)
            img_array = np.array(img, dtype=np.int16)
            img_array = np.clip(img_array + noise, 0, 255).astype(np.uint8)
            img = Image.fromarray(img_array)
        
        # Add watermark
        try:
            logo = Image.open(LOGO_PATH).convert('RGBA')
            logo = logo.resize((int(CANVAS_W * WATERMARK_RELATIVE_WIDTH), int(logo.height * (int(CANVAS_W * WATERMARK_RELATIVE_WIDTH) / logo.width))), Image.Resampling.LANCZOS)
            
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
        
        # Save image
        img.save(out_path, 'JPEG', quality=90)


def run_ffmpeg_video_build(src_paths: List[Path], out_path: Path, service: str) -> Optional[Path]:
    """Generate a video reel from a list of images with dynamic transitions and effects"""
    try:
        if not src_paths:
            raise ValueError("No source images provided for video generation")
        
        # Create a temporary directory for intermediate files
        temp_dir = OUTPUT_DIR / "temp"
        temp_dir.mkdir(exist_ok=True)
        
        # Generate video segments for each image with different effects
        segment_files = []
        segment_duration = VIDEO_DURATION / len(src_paths)
        
        # Define different effects for variety
        effects = [
            "zoompan=z='min(zoom+0.0015,1.5)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=250",  # Zoom in
            "zoompan=z='max(zoom-0.0015,1.0)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=250",  # Zoom out
            "scale={VIDEO_WIDTH}*1.2:{VIDEO_HEIGHT}*1.2,crop={VIDEO_WIDTH}:{VIDEO_HEIGHT}:x=(iw-iw/1.2)/2+((iw/1.2-{VIDEO_WIDTH})/2)*sin(t*1.5):y=(ih-ih/1.2)/2+((ih/1.2-{VIDEO_HEIGHT})/2)*cos(t*1.5)",  # Panning
            "scale={VIDEO_WIDTH}*1.3:{VIDEO_HEIGHT}*1.3,crop={VIDEO_WIDTH}:{VIDEO_HEIGHT}:x=(iw-{VIDEO_WIDTH})/2:y=(ih-{VIDEO_HEIGHT})/2+h*sin(t*2)*10",  # Vertical movement
            "scale={VIDEO_WIDTH}*1.3:{VIDEO_HEIGHT}*1.3,crop={VIDEO_WIDTH}:{VIDEO_HEIGHT}:x=(iw-{VIDEO_WIDTH})/2+w*cos(t*2)*10:y=(ih-{VIDEO_HEIGHT})/2",  # Horizontal movement
            "scale={VIDEO_WIDTH}:{VIDEO_HEIGHT},rotate=PI/180*sin(t*3)"  # Gentle rotation
        ]
        
        for i, src_path in enumerate(src_paths):
            segment_file = temp_dir / f"segment_{i:03d}.mp4"
            segment_files.append(segment_file)
            
            # Select effect for this segment
            effect = effects[i % len(effects)]
            
            # Build filter for this segment with dynamic effect
            filter_complex = (
                f"[0:v]scale={VIDEO_WIDTH}:{VIDEO_HEIGHT}:force_original_aspect_ratio=increase,"
                f"crop={VIDEO_WIDTH}:{VIDEO_HEIGHT},"
                f"{effect}"
            )
            
            # Add fade in/out effects for smooth transitions
            if i == 0:
                filter_complex += f",fade=t=in:st=0:d=0.5"
            if i == len(src_paths) - 1:
                filter_complex += f",fade=t=out:st={segment_duration-0.5}:d=0.5"
            
            # Add watermark to each segment
            wm_target_w = int(VIDEO_WIDTH * WATERMARK_RELATIVE_WIDTH)
            filter_complex += f"[v];[v][1:v]overlay=x=main_w-overlay_w-{WATERMARK_MARGIN}:y=main_h-overlay_h-{WATERMARK_MARGIN}[out]"
            
            cmd = [
                "ffmpeg", "-y", "-loglevel", "error",
                "-i", str(src_path),
                "-i", str(LOGO_PATH),
                "-filter_complex", filter_complex,
                "-map", "[out]",
                "-t", str(segment_duration),
                "-r", str(VIDEO_FPS),
                "-c:v", "libx264",
                "-preset", "ultrafast",
                "-crf", "23",
                "-pix_fmt", "yuv420p",
                str(segment_file),
            ]
            subprocess.run(cmd, check=True)
        
        # Create a text file listing all segments
        list_file = temp_dir / "segments.txt"
        with open(list_file, "w") as f:
            for segment_file in segment_files:
                f.write(f"file '{segment_file}'\n")
        
        # Concatenate all segments into final video
        cmd = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-f", "concat",
            "-safe", "0",
            "-i", str(list_file),
            "-c", "copy",
            str(out_path),
        ]
        subprocess.run(cmd, check=True)
        
        # Clean up temporary files
        for segment_file in segment_files:
            if segment_file.exists():
                segment_file.unlink()
        if list_file.exists():
            list_file.unlink()
        if temp_dir.exists():
            temp_dir.rmdir()
    except FileNotFoundError:
        # FFmpeg not installed, create a simple slideshow instead
        print("FFmpeg not found, creating simple slideshow")
        from PIL import Image
        import numpy as np
        
        # Create a simple slideshow with transitions
        images = []
        for src_path in src_paths[:6]:  # Limit to 6 images
            try:
                img = Image.open(src_path).convert('RGB')
                img = img.resize((VIDEO_WIDTH, VIDEO_HEIGHT), Image.Resampling.LANCZOS)
                images.append(img)
            except Exception as e:
                print(f"Warning: Could not load image {src_path}: {e}")
        
        if not images:
            raise ValueError("No valid images found for video generation")
        
        # Create a simple slideshow with basic transitions
        try:
            # Try to use moviepy if available
            from moviepy.editor import ImageSequenceClip
            import tempfile
            
            # Save images temporarily
            temp_images = []
            for i, img in enumerate(images):
                temp_img_path = temp_dir / f"temp_img_{i}.jpg"
                img.save(temp_img_path, 'JPEG', quality=85)
                temp_images.append(str(temp_img_path))
            
            # Create slideshow
            clip = ImageSequenceClip(temp_images, fps=1)  # 1 image per second
            clip = clip.set_duration(VIDEO_DURATION)
            clip.write_videofile(str(out_path), fps=VIDEO_FPS, codec='libx264')
            
            # Clean up temp images
            for temp_img_path in temp_images:
                Path(temp_img_path).unlink()
            return out_path  # Return the MP4 path
        except ImportError:
            # Fallback: create a simple animated GIF
            print("MoviePy not available, creating animated GIF instead")
            gif_path = out_path.with_suffix('.gif')
            images[0].save(
                gif_path,
                save_all=True,
                append_images=images[1:],
                duration=1000,
                loop=0
            )
            print(f"Created animated GIF at {gif_path}")
            return gif_path  # Return the GIF path instead of MP4
    return out_path  # Return the original MP4 path if successful


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

    # Randomly decide whether to use AI-generated image (10% chance to reduce fake content)
    if HUGGING_FACE_ENABLED and random.random() < 0.1:
        # Generate AI image
        ai_image_path = OUTPUT_DIR / f"{timestamp}_{service.replace(' ', '_').lower()}_ai.jpg"
        prompt = generate_concept_based_prompt(service)
        
        if generate_ai_image(prompt, ai_image_path):
            # Use AI-generated image
            out_path = ai_image_path
            
            # Apply watermark using FFmpeg
            watermarked_path = OUTPUT_DIR / f"{timestamp}_{service.replace(' ', '_').lower()}_final.jpg"
            wm_target_w = int(CANVAS_W * WATERMARK_RELATIVE_WIDTH)
            
            cmd = [
                "ffmpeg", "-y", "-loglevel", "error",
                "-i", str(out_path),
                "-i", str(LOGO_PATH),
                "-filter_complex", f"[0:v]scale={CANVAS_W}:{CANVAS_H}:force_original_aspect_ratio=increase,crop={CANVAS_W}:{CANVAS_H}[base];[base][1:v]overlay=x=main_w-overlay_w-{WATERMARK_MARGIN}:y=main_h-overlay_h-{WATERMARK_MARGIN}",
                "-frames:v", "1",
                "-q:v", "3",
                str(watermarked_path),
            ]
            subprocess.run(cmd, check=True)
            
            # Use watermarked image as final output
            out_path = watermarked_path
        else:
            # Fallback to regular image processing
            run_ffmpeg_build(image_path, out_path, variant, style, color_filter, theme)
    else:
        # Use regular image processing
        run_ffmpeg_build(image_path, out_path, variant, style, color_filter, theme)

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
    out_path = OUTPUT_DIR / f"{timestamp}_{service.replace(' ', '_').lower()}_reel.mp4"
    
    # Generate the video reel with more dynamic transitions
    video_path = run_ffmpeg_video_build(image_paths, out_path, service)
    if video_path:
        out_path = video_path  # Use the returned path (could be GIF or MP4)
    
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
    """Send a video to Telegram"""
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


if __name__ == "__main__":
    sys.exit(main())