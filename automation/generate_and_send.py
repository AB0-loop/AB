#!/usr/bin/env python3
import os
import sys
import json
import random
import datetime as dt
from pathlib import Path
from typing import Dict, List, Tuple

import requests
from PIL import Image, ImageOps, ImageFilter

# ------------------------------
# Config
# ------------------------------
REPO_ROOT = Path(__file__).resolve().parents[1]
ASSETS_DIR = REPO_ROOT / "assets"
SERVICES_DIR = ASSETS_DIR / "images" / "services"
LOGO_PATH = ASSETS_DIR / "logos" / "aurum-logo-gold.png"
OUTPUT_DIR = REPO_ROOT / "automation" / "out"
STATE_PATH = REPO_ROOT / "automation" / "state.json"

# Canvas config (portrait social size)
CANVAS_W = 1080
CANVAS_H = 1350
BACKGROUND_COLOR = (0, 0, 0)  # pure black to match site theme
WATERMARK_RELATIVE_WIDTH = 0.16  # watermark width relative to canvas width
WATERMARK_MARGIN = 28  # px from edges

# Daily posting limits
MIN_POSTS_PER_DAY = 2
MAX_POSTS_PER_DAY = 5

# Telegram
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_ID", "").strip()
TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}"

# Services mapping to available images and captions
SERVICE_CONFIG = {
    "Suit": {
        "files": ["suit.jpg"],
        "emojis": "🕴️✨",
        "caption": "Aurum Bespoke Suit — hand-cut, precision-tailored, and finished for commanding presence.",
    },
    "Tuxedo": {
        "files": ["blazer.jpg"],  # using blazer visual for tux/blazer rotation
        "emojis": "🎩🌙",
        "caption": "Black‑tie mastery. An Aurum Tuxedo that speaks in whispers and is heard across the room.",
    },
    "Sherwani": {
        "files": ["sherwani.jpg"],
        "emojis": "👑🌟",
        "caption": "Regal lines. Modern ease. The Aurum Sherwani — crafted for celebrations that matter.",
    },
    "Kurta Pathani": {
        "files": ["kurta.jpg"],
        "emojis": "🧵🌿",
        "caption": "Classic comfort with tailored sharpness — Kurta Pathani by Aurum Bespoke.",
    },
    "Bandgala": {
        "files": ["bandgala.jpg"],
        "emojis": "🥇🔥",
        "caption": "Bandgala by Aurum — structured, stately, and unmistakably elegant.",
    },
    "Tailored Shirt": {
        "files": ["shirt.jpg"],
        "emojis": "👔✨",
        "caption": "Subtle details. Impeccable fit. The Aurum Tailored Shirt elevates every day.",
    },
}

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
                return json.load(f)
            except Exception:
                pass
    return {"last_slno": 0, "last_post_date": "", "count_today": 0, "target_today": 0}


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
        state["target_today"] = random.randint(MIN_POSTS_PER_DAY, MAX_POSTS_PER_DAY)
        save_state(state)


def list_service_images() -> List[Tuple[str, Path]]:
    pairs = []
    for service, cfg in SERVICE_CONFIG.items():
        for fname in cfg["files"]:
            p = SERVICES_DIR / fname
            if p.exists():
                pairs.append((service, p))
    random.shuffle(pairs)
    return pairs


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

    # Optional opacity control (keep brand crisp). If needed, can lower alpha.
    # position bottom-right with margin
    pos = (CANVAS_W - logo_resized.width - WATERMARK_MARGIN,
           CANVAS_H - logo_resized.height - WATERMARK_MARGIN)
    base = base.convert("RGBA")
    base.alpha_composite(logo_resized, dest=pos)

    # Save as high-quality JPEG
    final = base.convert("RGB")
    final.save(out_path, format="JPEG", quality=92, optimize=True)

    # Build caption
    sc = SERVICE_CONFIG[service]
    emojis = sc["emojis"]
    core_caption = sc["caption"]
    handle = BRAND_HANDLE
    hashtag_set = random.choice(HASHTAG_POOLS)
    # Rotate hashtags a bit
    hash_sample = hashtag_set.copy()
    random.shuffle(hash_sample)
    hashtags = " ".join(hash_sample[: min(22, len(hash_sample))])

    caption = (
        f"Aurum Bespoke | {service}\n"
        f"SL No: {slno_str}\n\n"
        f"{emojis} {core_caption}\n\n"
        f"Book a home visit: https://aurumbespoke.com/#contact\n"
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
    if state.get("count_today", 0) >= state.get("target_today", MIN_POSTS_PER_DAY):
        print("Target reached for today; no post sent.")
        return 0

    # Next serial number
    next_slno = int(state.get("last_slno", 0)) + 1
    if next_slno > 999:
        next_slno = 1

    # Pick a service + image (rotate)
    pairs = list_service_images()
    if not pairs:
        print("No service images found.")
        return 0

    # Prefer varying services by using remainder of slno
    service_idx = (next_slno - 1) % len(pairs)
    service, image_path = pairs[service_idx]

    # Build post
    photo_path, caption = build_post(service, image_path, next_slno)

    # Send to Telegram
    send_to_telegram(photo_path, caption)

    # Update state
    state["last_slno"] = next_slno
    state["count_today"] = state.get("count_today", 0) + 1
    save_state(state)

    print(f"Sent post {next_slno:03d} for service: {service}")
    return 0


if __name__ == "__main__":
    sys.exit(main())