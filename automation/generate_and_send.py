#!/usr/bin/env python3
import os
import sys
import json
import random
import datetime as dt
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Set

import requests
from PIL import Image, ImageOps, ImageFilter

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
HASHTAG_POOLS: List[List[str]] = [
    [
        "#AurumBespoke", "#Bangalore", "#Bengaluru", "#Karnataka",
        "#JPnagar", "#Jayanagar", "#Indiranagar", "#Koramangala",
        "#Menswear", "#MensStyle", "#Bespoke", "#Tailoring",
        "#GroomStyle", "#WeddingWear", "#Sherwani", "#Tuxedo",
        "#Bandgala", "#Pathani", "#SuitUp", "#MadeToMeasure",
        "#LuxuryMenswear", "#BangaloreFashion",
    ],
    [
        "#AurumBespoke", "#NammaBengaluru", "#KarnatakaFashion", "#BangaloreGrooms",
        "#Ulsoor", "#Whitefield", "#HSRLAYOUT", "#Sadashivanagar",
        "#CustomTailor", "#BespokeTailor", "#MensFashion", "#MensOutfit",
        "#IndianGroom", "#GroomOutfit", "#WeddingSeason", "#EveningWear",
        "#Blazer", "#SherwaniStyle", "#KurtaPathani", "#BespokeSuits",
        "#StyleInBangalore",
    ],
    [
        "#AurumBespoke", "#BangaloreCity", "#KarnatakaStyle", "#BangaloreLuxury",
        "#MGroad", "#BrigadeRoad", "#ChurchStreet", "#LavelleRoad",
        "#MensLook", "#SharpStyle", "#TailorMade", "#SavileRowSpirit",
        "#Suits", "#Tuxedos", "#Sherwanis", "#BandgalaStyle",
        "#PathaniSuit", "#LuxuryStyle", "#FashionBangalore",
    ],
]

BRAND_HANDLE = "@aurum.bespoke"


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
    data.setdefault("used_images", [])  # track used image relative paths to avoid repeats across days
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
                # Not under IMAGES_ROOT; use name only
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


def choose_service(state: Dict) -> Tuple[str, Path, str]:
    # Prefer unique service per day and unique image across history
    used_today = set(state.get("used_today", []))
    used_images = set(state.get("used_images", []))

    # Start from next index based on last slno
    next_idx = (int(state.get("last_slno", 0))) % len(SERVICE_KEYS)
    ordered_services = [SERVICE_KEYS[(next_idx + i) % len(SERVICE_KEYS)] for i in range(len(SERVICE_KEYS))]

    # First pass: enforce both per-day unique service and never-before-used image
    for service in ordered_services:
        if service in used_today:
            continue
        cfg = SERVICE_CONFIG[service]
        for fname in cfg["files"]:
            resolved = resolve_image_path(fname)
            if resolved is None:
                continue
            p, rel = resolved
            if rel in used_images:
                continue
            return service, p, rel

    # Second pass: allow previously used image if needed, but still unique service per day
    for service in ordered_services:
        if service in used_today:
            continue
        cfg = SERVICE_CONFIG[service]
        for fname in cfg["files"]:
            resolved = resolve_image_path(fname)
            if resolved is None:
                continue
            p, rel = resolved
            return service, p, rel

    # Fallback: if all services used today, pick any available image ignoring used_today
    for service in SERVICE_KEYS:
        cfg = SERVICE_CONFIG[service]
        for fname in cfg["files"]:
            resolved = resolve_image_path(fname)
            if resolved is None:
                continue
            p, rel = resolved
            return service, p, rel

    raise RuntimeError("No service images found.")


def build_post(service: str, image_path: Path, slno: int) -> Tuple[Path, str]:
    # Compose image on portrait canvas with watermark bottom-right
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    slno_str = f"{slno:03d}"
    out_path = OUTPUT_DIR / f"{slno_str}_{service.replace(' ', '_').lower()}.jpg"

    # Open and fit image
    base = Image.new("RGB", (CANVAS_W, CANVAS_H), BACKGROUND_COLOR)
    src = Image.open(image_path).convert("RGB")

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

    # Build caption (strict lines included)
    sc = SERVICE_CONFIG[service]
    emojis = sc["emojis"]
    core_caption = sc["caption"]
    handle = BRAND_HANDLE
    hashtag_set = random.choice(HASHTAG_POOLS)
    hash_sample = hashtag_set.copy()
    random.shuffle(hash_sample)
    hashtags = " ".join(hash_sample[: min(22, len(hash_sample))])

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

    # Pick a service + image (enforce unique per day and avoid repeats across days)
    service, image_path, image_rel = choose_service(state)

    # Build post
    photo_path, caption = build_post(service, image_path, next_slno)

    # Send to Telegram
    send_to_telegram(photo_path, caption)

    # Update state
    state["last_slno"] = next_slno
    state["count_today"] = state.get("count_today", 0) + 1

    used = state.get("used_today", [])
    used.append(service)
    state["used_today"] = used

    used_images: List[str] = state.get("used_images", [])
    if image_rel not in set(used_images):
        used_images.append(image_rel)
    # Reset the history once we've cycled through all available images
    all_rels = compute_all_available_rels()
    if all_rels and set(used_images) >= all_rels:
        used_images = []
    state["used_images"] = used_images

    save_state(state)

    print(f"Sent post {next_slno:03d} for service: {service} using {image_rel}")
    return 0


if __name__ == "__main__":
    sys.exit(main())