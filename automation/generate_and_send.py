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
from PIL import Image  # only for existence checks when needed; not used for heavy processing

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
SITE_INDEX = REPO_ROOT / "index.html"

# Daily composition requirements
MIN_MALE_PER_DAY = 3

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

# Explicit image metadata (whether the image contains a male character)
# Services images are product-style (assume no visible model), gallery images are model shots
IMAGE_METADATA: Dict[str, Dict[str, bool]] = {
    # Services (assume no visible male model)
    "services/suit.jpg": {"male": False},
    "services/suit.jpg.webp": {"male": False},
    "services/blazer.jpg": {"male": False},
    "services/blazer.jpg.webp": {"male": False},
    "services/sherwani.jpg": {"male": False},
    "services/sherwani.jpg.webp": {"male": False},
    "services/bandgala.jpg": {"male": False},
    "services/bandgala.jpg.webp": {"male": False},
    "services/shirt.jpg": {"male": False},
    "services/shirt.jpg.webp": {"male": False},
    "services/kurta.jpg": {"male": False},
    "services/kurta.jpg.webp": {"male": False},
    "services/modi-jacket.jpg": {"male": False},
    "services/modi-jacket.jpg.webp": {"male": False},

    # Gallery (assume visible male model)
    "gallery/kurta.jpg": {"male": True},
    "gallery/bandgalla.jpg": {"male": True},
    "gallery/indowestern.jpg": {"male": True},
    "gallery/gallery1.jpg": {"male": True},
    "gallery/gallery2.jpg": {"male": True},
    "gallery/gallery3.jpg": {"male": True},
    "gallery/gallery4.jpg": {"male": True},
    "gallery/gallery5.jpg": {"male": True},
    "gallery/gallery6.jpg": {"male": True},
    "gallery/gallery7.jpg": {"male": True},
    "gallery/gallery8.jpg": {"male": True},
    "gallery/gallery9.jpg": {"male": True},
}

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

# Augmentation styles to generate new visuals for free
AUGMENT_STYLES: List[str] = [
    "none",
    "crop_zoom",
    "vignette",
    "gold_border",
    "soft_focus",
    "gradient_overlay",
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
    data.setdefault("male_count_today", 0)
    data.setdefault("used_today", [])
    data.setdefault("used_images", [])  # avoid repeats across days (by image)
    data.setdefault("used_posts", [])   # avoid repeats across days (by image+variant+style+seed)
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
        state["male_count_today"] = 0
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
                for s in AUGMENT_STYLES:
                    # seed is effectively unbounded; track by style only for universe estimation
                    keys.add(f"{rel}::{v}::{s}")
    return keys


def get_site_used_rels() -> Set[str]:
    used: Set[str] = set()
    if not SITE_INDEX.exists():
        return used
    try:
        html = SITE_INDEX.read_text(encoding="utf-8")
    except Exception:
        return used
    # Naive scan for src="..." under assets/images/
    import re
    for m in re.finditer(r'src\s*=\s*"([^"]+)"', html):
        src = m.group(1)
        # we only care about assets/images/
        if "/assets/images/" not in src:
            continue
        try:
            # Map to path relative to IMAGES_ROOT
            p = (REPO_ROOT / src.lstrip("/"))
            if not p.exists():
                continue
            rel = str(p.relative_to(IMAGES_ROOT))
            used.add(rel)
        except Exception:
            continue
    return used


def choose_service_and_variant(state: Dict) -> Tuple[str, Path, str, str, str, int]:
    # Prefer unique service per day and unique (image+variant+style+seed) across history
    used_today = set(state.get("used_today", []))
    used_posts = set(state.get("used_posts", []))
    male_count_today = int(state.get("male_count_today", 0))

    need_male = male_count_today < MIN_MALE_PER_DAY
    site_used_rels = get_site_used_rels()

    # Start from next index based on last slno
    next_idx = (int(state.get("last_slno", 0))) % len(SERVICE_KEYS)
    ordered_services = [SERVICE_KEYS[(next_idx + i) % len(SERVICE_KEYS)] for i in range(len(SERVICE_KEYS))]

    def is_male(rel: str) -> bool:
        meta = IMAGE_METADATA.get(rel, {})
        return bool(meta.get("male", False))

    def try_return(service: str, p: Path, rel: str) -> Optional[Tuple[str, Path, str, str, str, int]]:
        variants = VARIANTS.copy()
        random.shuffle(variants)
        styles = AUGMENT_STYLES.copy()
        random.shuffle(styles)
        for v in variants:
            for s in styles:
                # bounded random seed bucket to allow uniqueness without exploding state
                seed = random.randint(1, 10_000_000)
                key = f"{rel}::{v}::{s}::{seed//1000}"
                if key in used_posts:
                    continue
                return service, p, rel, v, s, seed
        return None

    # First pass: enforce day-unique service, exclude site images, prefer male quota, and avoid used combos
    for service in ordered_services:
        if service in used_today:
            continue
        for fname in SERVICE_CONFIG[service]["files"]:
            resolved = resolve_image_path(fname)
            if resolved is None:
                continue
            p, rel = resolved
            if rel in site_used_rels:
                continue
            if need_male and not is_male(rel):
                continue
            got = try_return(service, p, rel)
            if got:
                return got

    # Second pass: still exclude site images; try to satisfy male quota if pending
    for service in ordered_services:
        if service in used_today:
            continue
        for fname in SERVICE_CONFIG[service]["files"]:
            resolved = resolve_image_path(fname)
            if resolved is None:
                continue
            p, rel = resolved
            if rel in site_used_rels:
                continue
            if need_male and not is_male(rel):
                continue
            got = try_return(service, p, rel)
            if got:
                return got

    # Final fallback: if exclusion exhausts pool, allow site images but still aim for male quota
    for service in SERVICE_KEYS:
        for fname in SERVICE_CONFIG[service]["files"]:
            resolved = resolve_image_path(fname)
            if resolved is None:
                continue
            p, rel = resolved
            if need_male and not is_male(rel):
                continue
            got = try_return(service, p, rel)
            if got:
                return got

    raise RuntimeError("No service images found.")


def build_ffmpeg_filter(variant: str, style: str, wm_w: int) -> Tuple[str, str]:
    """Return (filter_complex, out_label) for ffmpeg.
    Streams: [0:v] = src, [1:v] = watermark
    """
    lbl_base = "base"
    lbl_proc = "proc"
    lbl_wm = "wm"
    lbl_out = "out"

    # Base: cover fit to 1080x1350 and subtle sharpen
    chain_base = (
        f"[0:v]scale={CANVAS_W}:{CANVAS_H}:force_original_aspect_ratio=increase,"
        f"crop={CANVAS_W}:{CANVAS_H},unsharp=5:5:0.6:5:5:0.0[{lbl_base}]"
    )

    # Variant adjustments
    variant_filters = {
        "none": "",
        "contrast": "eq=contrast=1.08",
        "warm": "eq=saturation=1.06,colorchannelmixer=rr=1.03:gg=1.01:bb=1.0",
        "cool": "eq=saturation=1.02,colorchannelmixer=bb=1.04:gg=1.01:rr=1.0",
        "golden_glow": "drawbox=x=0:y=0:w=iw:h=ih:color=0xc99e67@0.06:t=fill",
    }
    vf = variant_filters.get(variant, "")

    # Augmentation styles
    style_filters = {
        "none": "",
        "crop_zoom": "crop=iw*0.92:ih*0.92,scale=1080:1350",
        "vignette": "vignette",
        "gold_border": "pad=iw+48:ih+48:(ow-iw)/2:(oh-ih)/2:0xC99E67,scale=1080:1350",  # gold pad then scale back
        "soft_focus": "gblur=sigma=2.0",
        "gradient_overlay": "drawbox=x=0:y=0:w=iw:h=ih:color=0xc99e67@0.06:t=fill",
    }
    sf = style_filters.get(style, "")

    # Build processing chain from base -> (style) -> (variant)
    procs = []
    if sf:
        procs.append(sf)
    if vf:
        procs.append(vf)
    proc_part = ",".join(procs) if procs else "null"
    chain_proc = f"[{lbl_base}]{proc_part}[{lbl_proc}]"

    # Watermark scale and overlay
    chain_wm = f"[1:v]scale={wm_w}:-1[{lbl_wm}]"
    chain_overlay = (
        f"[{lbl_proc}][{lbl_wm}]overlay=x=main_w-overlay_w-{WATERMARK_MARGIN}:y=main_h-overlay_h-{WATERMARK_MARGIN}[{lbl_out}]"
    )

    filter_complex = ",".join([chain_base, chain_proc, chain_wm, chain_overlay])
    return filter_complex, lbl_out


def run_ffmpeg_build(src_path: Path, out_path: Path, variant: str, style: str) -> None:
    wm_target_w = int(CANVAS_W * WATERMARK_RELATIVE_WIDTH)
    filter_complex, out_label = build_ffmpeg_filter(variant, style, wm_target_w)
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


def choose_hashtags() -> str:
    selection: List[str] = []
    core = ["#AurumBespoke", "#Bangalore", "#Bengaluru", "#Karnataka", "#NammaBengaluru"]
    selection.extend(core)
    neighborhoods = random.sample(BANGALORE_NEIGHBORHOODS, k=min(8, len(BANGALORE_NEIGHBORHOODS)))
    selection.extend(neighborhoods)
    style = random.sample(GENERAL_STYLE, k=min(4, len(GENERAL_STYLE)))
    selection.extend(style)
    ktags = random.sample(KARNATAKA_TAGS, k=min(2, len(KARNATAKA_TAGS)))
    selection.extend(ktags)
    cats = random.sample(CATEGORY_TAGS, k=min(8, len(CATEGORY_TAGS)))
    selection.extend(cats)

    seen = set()
    uniq: List[str] = []
    for tag in selection:
        if tag not in seen:
            uniq.append(tag)
            seen.add(tag)
    random.shuffle(uniq)
    return " ".join(uniq[:TOTAL_HASHTAGS])


def build_post(service: str, image_path: Path, slno: int, variant: str, style: str, seed: int) -> Tuple[Path, str]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    slno_str = f"{slno:03d}"
    out_path = OUTPUT_DIR / f"{slno_str}_{service.replace(' ', '_').lower()}.jpg"

    # CPU-friendly FFmpeg pipeline to generate final image with watermark
    run_ffmpeg_build(image_path, out_path, variant, style)

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


def main() -> int:
    state = load_state()
    pick_today_target(state)

    if state.get("count_today", 0) >= DAILY_POST_TARGET:
        print("Target reached for today; no post sent.")
        return 0

    next_slno = int(state.get("last_slno", 0)) + 1
    if next_slno > 999:
        next_slno = 1

    service, image_path, image_rel, variant, style, seed = choose_service_and_variant(state)

    photo_path, caption = build_post(service, image_path, next_slno, variant, style, seed)

    send_to_telegram(photo_path, caption)

    state["last_slno"] = next_slno
    state["count_today"] = state.get("count_today", 0) + 1

    used = state.get("used_today", [])
    used.append(service)
    state["used_today"] = used

    used_images: List[str] = state.get("used_images", [])
    if image_rel not in set(used_images):
        used_images.append(image_rel)
    state["used_images"] = used_images

    used_posts: List[str] = state.get("used_posts", [])
    key = f"{image_rel}::{variant}::{style}::{seed//1000}"
    if key not in set(used_posts):
        used_posts.append(key)

    if IMAGE_METADATA.get(image_rel, {}).get("male", False):
        state["male_count_today"] = int(state.get("male_count_today", 0)) + 1

    all_rels = compute_all_available_rels()
    if all_rels and set(used_images) >= all_rels:
        used_images = []
    all_keys = compute_all_available_post_keys()
    if all_keys and {k.rsplit("::", 1)[0] for k in used_posts} >= all_keys:
        used_posts = []

    state["used_images"] = used_images
    state["used_posts"] = used_posts

    save_state(state)

    print(f"Sent post {next_slno:03d} for service: {service} using {image_rel} [{variant}|{style}|{seed}]")
    return 0


if __name__ == "__main__":
    sys.exit(main())