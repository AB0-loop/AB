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


def apply_variant(image: Image.Image, variant: str) -> Image.Image:
    if variant == "none":
        return image
    if variant == "contrast":
        enhancer = ImageEnhance.Contrast(image)
        return enhancer.enhance(1.08)
    if variant == "warm":
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
        overlay = Image.new("RGB", image.size, (201, 158, 103))  # #c99e67
        return Image.blend(image, overlay, alpha=0.06)
    return image


def apply_augmentation(image: Image.Image, style: str, seed: int) -> Image.Image:
    rnd = random.Random(seed)
    if style == "none":
        return image
    w, h = image.size
    if style == "crop_zoom":
        # random crop between 88-96% area then resize back
        scale = rnd.uniform(0.88, 0.96)
        cw = int(w * scale)
        ch = int(h * scale)
        left = rnd.randint(0, w - cw)
        top = rnd.randint(0, h - ch)
        return image.crop((left, top, left + cw, top + ch)).resize((w, h), Image.LANCZOS)
    if style == "vignette":
        # radial darkening toward edges
        vignette = Image.new("L", (w, h), 0)
        cx, cy = w / 2, h / 2
        max_r2 = (cx**2 + cy**2)
        px = vignette.load()
        for y in range(h):
            for x in range(w):
                dx, dy = x - cx, y - cy
                r2 = dx*dx + dy*dy
                t = min(1.0, r2 / max_r2)
                val = int(255 * t**1.5)
                px[x, y] = val
        return Image.composite(Image.new("RGB", (w, h), (0, 0, 0)), image, vignette.filter(ImageFilter.GaussianBlur(6)))
    if style == "gold_border":
        border = 24
        framed = Image.new("RGB", (w + border*2, h + border*2), (201, 158, 103))
        framed.paste(image, (border, border))
        return framed.resize((w, h), Image.LANCZOS)
    if style == "soft_focus":
        return image.filter(ImageFilter.GaussianBlur(radius=2))
    if style == "gradient_overlay":
        overlay = Image.new("RGBA", (w, h))
        opx = overlay.load()
        for y in range(h):
            alpha = int(64 * (y / h))
            for x in range(w):
                opx[x, y] = (201, 158, 103, alpha)
        return Image.alpha_composite(image.convert("RGBA"), overlay).convert("RGB")
    return image


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

    base = Image.new("RGB", (CANVAS_W, CANVAS_H), BACKGROUND_COLOR)
    src = Image.open(image_path).convert("RGB")

    # Apply augmentation + color variant
    src = apply_augmentation(src, style, seed)
    src = apply_variant(src, variant)

    # Fit to canvas
    src_ratio = src.width / src.height
    canvas_ratio = CANVAS_W / CANVAS_H
    if src_ratio > canvas_ratio:
        new_h = CANVAS_H
        new_w = int(src_ratio * new_h)
    else:
        new_w = CANVAS_W
        new_h = int(new_w / src_ratio)
    resized = src.resize((new_w, new_h), Image.LANCZOS)

    left = (new_w - CANVAS_W) // 2
    top = (new_h - CANVAS_H) // 2
    cropped = resized.crop((left, top, left + CANVAS_W, top + CANVAS_H))

    sharpened = cropped.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=3))

    base.paste(sharpened, (0, 0))

    # Watermark bottom-right
    logo = Image.open(LOGO_PATH).convert("RGBA")
    wm_target_w = int(CANVAS_W * WATERMARK_RELATIVE_WIDTH)
    wm_ratio = logo.width / logo.height
    wm_size = (wm_target_w, int(wm_target_w / wm_ratio))
    logo_resized = logo.resize(wm_size, Image.LANCZOS)

    pos = (CANVAS_W - logo_resized.width - WATERMARK_MARGIN,
           CANVAS_H - logo_resized.height - WATERMARK_MARGIN)
    base = base.convert("RGBA")
    base.alpha_composite(logo_resized, dest=pos)

    final = base.convert("RGB")
    final.save(out_path, format="JPEG", quality=92, optimize=True)

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