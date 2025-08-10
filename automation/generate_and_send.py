#!/usr/bin/env python3
import os
import sys
import json
import random
import datetime as dt
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Set

import requests
from PIL import Image, ImageOps, ImageFilter, ImageEnhance

# ------------------------------
# Config
# ------------------------------
REPO_ROOT = Path(__file__).resolve().parents[1]
ASSETS_DIR = REPO_ROOT / "assets"
SERVICES_DIR = ASSETS_DIR / "images" / "services"
IMAGES_ROOT = ASSETS_DIR / "images"
LOGO_PATH = ASSETS_DIR / "logos" / "aurum-logo-gold.png"
OUTPUT_DIR = REPO_ROOT / "automation" / "out"
STATE_PATH = REPO_ROOT / "automation" / "state.json"

# Canvas config (portrait social size)
CANVAS_W = 1080
CANVAS_H = 1350
BACKGROUND_COLOR = (0, 0, 0)  # pure black to match site theme
WATERMARK_RELATIVE_WIDTH = 0.16  # watermark width relative to canvas width
WATERMARK_MARGIN = 28  # px from edges

# Daily posting limits (exactly 5/day)
DAILY_POST_TARGET = 5

# Telegram
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_ID", "").strip()
TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}"

# Services mapping to available images and captions
SERVICE_CONFIG = {
    "Suit": {
        "files": ["suit.jpg", "suit.jpg.webp"],
        "emojis": "🕴️✨",
        "caption": "Aurum Bespoke Suit — hand-cut, precision-tailored, and finished for commanding presence.",
    },
    "Tuxedo": {
        "files": ["blazer.jpg", "blazer.jpg.webp"],  # using blazer visual for tux/blazer rotation
        "emojis": "🎩🌙",
        "caption": "Black‑tie mastery. An Aurum Tuxedo that speaks in whispers and is heard across the room.",
    },
    "Sherwani": {
        "files": ["sherwani.jpg", "sherwani.jpg.webp"],
        "emojis": "👑🌟",
        "caption": "Regal lines. Modern ease. The Aurum Sherwani — crafted for celebrations that matter.",
    },
    "Kurta Pathani": {
        "files": [
            "kurta.jpg",
            "kurta.jpg.webp",
            "gallery/kurta.jpg",  # fallback from gallery
        ],
        "emojis": "🧵🌿",
        "caption": "Classic comfort with tailored sharpness — Kurta Pathani by Aurum Bespoke.",
    },
    "Bandgala": {
        "files": [
            "bandgala.jpg",
            "bandgala.jpg.webp",
            "gallery/bandgalla.jpg",  # alternate spelling in gallery
        ],
        "emojis": "🥇🔥",
        "caption": "Bandgala by Aurum — structured, stately, and unmistakably elegant.",
    },
    "Tailored Shirt": {
        "files": ["shirt.jpg", "shirt.jpg.webp"],
        "emojis": "👔✨",
        "caption": "Subtle details. Impeccable fit. The Aurum Tailored Shirt elevates every day.",
    },
    "Modi Jacket": {
        "files": [
            "modi-jacket.jpg",
            "modi-jacket.jpg.webp",
            "gallery/indowestern.jpg",
            "gallery/indowestern.jpg.webp",
        ],
        "emojis": "🇮🇳✨",
        "caption": "Iconic Modi Jacket — timeless, versatile, and tailored to perfection.",
    },
}
SERVICE_KEYS: List[str] = list(SERVICE_CONFIG.keys())

# Hashtag pools for Bangalore/Karnataka rotation (aggressive, varied)
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

# Aim for consistent caption length; pick a fixed total hashtag count
TOTAL_HASHTAGS = 22

BRAND_HANDLE = "@aurum.bespoke"

# Visual variants for subtle, on-brand diversity without breaking theme
VARIANTS: List[str] = [
    "none",          # original
    "contrast",      # slightly crisper
    "warm",          # warm tone
    "cool",          # cool tone
    "golden_glow",   # very subtle golden tint
]


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
    data.setdefault("last_slno", 0)
    data.setdefault("last_post_date", "")
    data.setdefault("count_today", 0)
    data.setdefault("used_today", [])
    data.setdefault("used_images", [])  # avoid repeats across days (by image)
    data.setdefault("used_posts", [])   # avoid repeats across days (by image+variant)
    return data


def save_state(state: Dict) -> None:
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_PATH, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)


def pick_today_target(state: Dict) -> None:
    # Reset counters at local IST midnight (UTC+5:30)
    now_utc = dt.datetime.utcnow()
    ist = now_utc + dt.timedelta(hours=5, minutes=30)
    today_str = ist.strftime("%Y-%m-%d")

    if state.get("last_post_date") != today_str:
        state["last_post_date"] = today_str
        state["count_today"] = 0
        state["used_today"] = []
        save_state(state)


def resolve_image_path(fname: str) -> Optional[Tuple[Path, str]]:
    """Resolve an image file name to an absolute Path and a canonical relative string under IMAGES_ROOT.

    Supports both simple names (resolved under services) and nested paths like "gallery/kurta.jpg".
    Returns None if no existing file is found.
    """
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


def compute_all_available_rels() -> Set[str]:
    rels: Set[str] = set()
    for service in SERVICE_KEYS:
        for fname in SERVICE_CONFIG[service]["files"]:
            resolved = resolve_image_path(fname)
            if resolved is not None:
                _, rel = resolved
                rels.add(rel)
    return rels


def compute_all_available_post_keys() -> Set[str]:
    keys: Set[str] = set()
    for service in SERVICE_KEYS:
        for fname in SERVICE_CONFIG[service]["files"]:
            resolved = resolve_image_path(fname)
            if resolved is None:
                continue
            _, rel = resolved
            for v in VARIANTS:
                keys.add(f"{rel}::{v}")
    return keys


def choose_service_and_variant(state: Dict) -> Tuple[str, Path, str, str]:
    # Prefer unique service per day and unique (image+variant) across history
    used_today = set(state.get("used_today", []))
    used_posts = set(state.get("used_posts", []))

    # Start from next index based on last slno
    next_idx = (int(state.get("last_slno", 0))) % len(SERVICE_KEYS)
    ordered_services = [SERVICE_KEYS[(next_idx + i) % len(SERVICE_KEYS)] for i in range(len(SERVICE_KEYS))]

    # First pass: enforce both per-day unique service and never-before-used (image+variant)
    for service in ordered_services:
        if service in used_today:
            continue
        for fname in SERVICE_CONFIG[service]["files"]:
            resolved = resolve_image_path(fname)
            if resolved is None:
                continue
            p, rel = resolved
            # try variants in shuffled order to diversify
            variants = VARIANTS.copy()
            random.shuffle(variants)
            for v in variants:
                key = f"{rel}::{v}"
                if key in used_posts:
                    continue
                return service, p, rel, v

    # Second pass: allow previously used combos if needed, but still unique service per day
    for service in ordered_services:
        if service in used_today:
            continue
        for fname in SERVICE_CONFIG[service]["files"]:
            resolved = resolve_image_path(fname)
            if resolved is None:
                continue
            p, rel = resolved
            v = random.choice(VARIANTS)
            return service, p, rel, v

    # Fallback: pick any available ignoring used_today
    for service in SERVICE_KEYS:
        for fname in SERVICE_CONFIG[service]["files"]:
            resolved = resolve_image_path(fname)
            if resolved is None:
                continue
            p, rel = resolved
            v = random.choice(VARIANTS)
            return service, p, rel, v

    raise RuntimeError("No service images found.")


def apply_variant(image: Image.Image, variant: str) -> Image.Image:
    if variant == "none":
        return image
    if variant == "contrast":
        enhancer = ImageEnhance.Contrast(image)
        return enhancer.enhance(1.08)
    if variant == "warm":
        # Slight warmth via color/saturation and a subtle red/yellow lift
        image = ImageEnhance.Color(image).enhance(1.06)
        r, g, b = image.split()
        r = r.point(lambda i: min(255, int(i * 1.03)))
        g = g.point(lambda i: min(255, int(i * 1.01)))
        return Image.merge("RGB", (r, g, b))
    if variant == "cool":
        image = ImageEnhance.Color(image).enhance(1.02)
        r, g, b = image.split()
        b = b.point(lambda i: min(255, int(i * 1.04)))
        g = g.point(lambda i: min(255, int(i * 1.01)))
        return Image.merge("RGB", (r, g, b))
    if variant == "golden_glow":
        # Subtle golden tint overlay to align with brand accents
        overlay = Image.new("RGB", image.size, (201, 158, 103))  # #c99e67
        return Image.blend(image, overlay, alpha=0.06)
    return image


def choose_hashtags() -> str:
    # Build an aggressive, rotating set from all pools
    selection: List[str] = []
    # Ensure core brand/region tags present
    core = ["#AurumBespoke", "#Bangalore", "#Bengaluru", "#Karnataka", "#NammaBengaluru"]
    selection.extend(core)
    # Randomly sample neighborhoods, style, karnataka, category
    neighborhoods = random.sample(BANGALORE_NEIGHBORHOODS, k=min(8, len(BANGALORE_NEIGHBORHOODS)))
    selection.extend(neighborhoods)
    style = random.sample(GENERAL_STYLE, k=min(4, len(GENERAL_STYLE)))
    selection.extend(style)
    ktags = random.sample(KARNATAKA_TAGS, k=min(2, len(KARNATAKA_TAGS)))
    selection.extend(ktags)
    cats = random.sample(CATEGORY_TAGS, k=min(8, len(CATEGORY_TAGS)))
    selection.extend(cats)

    # Deduplicate while preserving order, then cap to TOTAL_HASHTAGS
    seen = set()
    uniq: List[str] = []
    for tag in selection:
        if tag not in seen:
            uniq.append(tag)
            seen.add(tag)
    random.shuffle(uniq)
    return " ".join(uniq[:TOTAL_HASHTAGS])


def build_post(service: str, image_path: Path, slno: int, variant: str) -> Tuple[Path, str]:
    # Compose image on portrait canvas with watermark bottom-right
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    slno_str = f"{slno:03d}"
    out_path = OUTPUT_DIR / f"{slno_str}_{service.replace(' ', '_').lower()}.jpg"

    # Open and fit image
    base = Image.new("RGB", (CANVAS_W, CANVAS_H), BACKGROUND_COLOR)
    src = Image.open(image_path).convert("RGB")

    # Apply variant for on-brand diversity
    src = apply_variant(src, variant)

    # Fit source to canvas while preserving aspect ratio (cover)
    src_ratio = src.width / src.height
    canvas_ratio = CANVAS_W / CANVAS_H
    if src_ratio > canvas_ratio:
        # Source wider than canvas
        new_h = CANVAS_H
        new_w = int(src_ratio * new_h)
    else:
        # Source taller/narrower
        new_w = CANVAS_W
        new_h = int(new_w / src_ratio)
    resized = src.resize((new_w, new_h), Image.LANCZOS)

    # Center-crop to exact canvas
    left = (new_w - CANVAS_W) // 2
    top = (new_h - CANVAS_H) // 2
    cropped = resized.crop((left, top, left + CANVAS_W, top + CANVAS_H))

    # Subtle sharpen for detail
    sharpened = cropped.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=3))

    # Paste to base
    base.paste(sharpened, (0, 0))

    # Add watermark bottom-right
    logo = Image.open(LOGO_PATH).convert("RGBA")
    wm_target_w = int(CANVAS_W * WATERMARK_RELATIVE_WIDTH)
    wm_ratio = logo.width / logo.height
    wm_size = (wm_target_w, int(wm_target_w / wm_ratio))
    logo_resized = logo.resize(wm_size, Image.LANCZOS)

    # position bottom-right with margin
    pos = (CANVAS_W - logo_resized.width - WATERMARK_MARGIN,
           CANVAS_H - logo_resized.height - WATERMARK_MARGIN)
    base = base.convert("RGBA")
    base.alpha_composite(logo_resized, dest=pos)

    # Save as high-quality JPEG
    final = base.convert("RGB")
    final.save(out_path, format="JPEG", quality=92, optimize=True)

    # Build caption (consistent lines, emojis, and aggressive tags)
    sc = SERVICE_CONFIG[service]
    emojis = sc["emojis"]
    core_caption = sc["caption"]
    handle = BRAND_HANDLE
    hashtags = choose_hashtags()

    caption = (
        f"Aurum Bespoke | {service}\n"
        f"SL No: {slno_str}\n\n"
        f"{emojis} {core_caption}\n\n"
        f"Book Your Home Visit\n"
        f"WhatsApp: +91 81055 08503\n"
        f"Website: www.aurumbespoke.com\n\n"
        f"{handle}\n\n"
        f"{hashtags}"
    )

    return out_path, caption


def send_to_telegram(photo_path: Path, caption: str) -> None:
    if not TELEGRAM_TOKEN or not TELEGRAM_CHAT_ID:
        raise RuntimeError("TELEGRAM_TOKEN/TELEGRAM_ID not set in environment.")

    url = f"{TELEGRAM_API}/sendPhoto"
    with open(photo_path, "rb") as f:
        files = {"photo": f}
        data = {"chat_id": TELEGRAM_CHAT_ID, "caption": caption}
        resp = requests.post(url, data=data, files=files, timeout=60)
        if resp.status_code != 200:
            raise RuntimeError(f"Telegram API error: {resp.status_code} {resp.text}")


def main() -> int:
    # Load/roll daily target
    state = load_state()
    pick_today_target(state)

    # If we've met today's target, exit cleanly
    if state.get("count_today", 0) >= DAILY_POST_TARGET:
        print("Target reached for today; no post sent.")
        return 0

    # Next serial number
    next_slno = int(state.get("last_slno", 0)) + 1
    if next_slno > 999:
        next_slno = 1

    # Pick a service + image + variant (enforce unique per day and avoid repeats across days)
    service, image_path, image_rel, variant = choose_service_and_variant(state)

    # Build post
    photo_path, caption = build_post(service, image_path, next_slno, variant)

    # Send to Telegram
    send_to_telegram(photo_path, caption)

    # Update state
    state["last_slno"] = next_slno
    state["count_today"] = state.get("count_today", 0) + 1

    used = state.get("used_today", [])
    used.append(service)
    state["used_today"] = used

    # Track image and image+variant usage across history
    used_images: List[str] = state.get("used_images", [])
    if image_rel not in set(used_images):
        used_images.append(image_rel)
    state["used_images"] = used_images

    used_posts: List[str] = state.get("used_posts", [])
    key = f"{image_rel}::{variant}"
    if key not in set(used_posts):
        used_posts.append(key)

    # Reset histories once we've cycled through all possibilities
    all_rels = compute_all_available_rels()
    if all_rels and set(used_images) >= all_rels:
        used_images = []
    all_keys = compute_all_available_post_keys()
    if all_keys and set(used_posts) >= all_keys:
        used_posts = []

    state["used_images"] = used_images
    state["used_posts"] = used_posts

    save_state(state)

    print(f"Sent post {next_slno:03d} for service: {service} using {image_rel} [{variant}]")
    return 0


if __name__ == "__main__":
    sys.exit(main())