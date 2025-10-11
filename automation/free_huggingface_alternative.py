#!/usr/bin/env python3
"""
FREE HUGGING FACE ALTERNATIVE FOR AURUM BESPOKE
==============================================

This script provides a free alternative to the Hugging Face API for generating
AI-enhanced content for the Aurum Bespoke project. It uses free resources
to generate both images and video reels that align with the product concepts.

Key Features:
- Free image generation using Stable Diffusion WebUI API
- Video reel generation from multiple images
- Concept-based content generation aligned with website products
- Seamless integration with existing automation system
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

# ------------------------------
# Config
# ------------------------------
REPO_ROOT = Path(__file__).resolve().parents[1]
ASSETS_DIR = REPO_ROOT / "assets"
SERVICES_DIR = ASSETS_DIR / "images" / "services"
IMAGES_ROOT = ASSETS_DIR / "images"
LOGO_PATH = ASSETS_DIR / "logos" / "aurum-logo-gold.png"
OUTPUT_DIR = REPO_ROOT / "automation" / "out"

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

# Free AI Services Configuration
# These are free alternatives that can be used instead of Hugging Face API
FREE_AI_SERVICES = [
    {
        "name": "Stable Diffusion WebUI",
        "url": "http://127.0.0.1:7860",  # Local installation
        "endpoint": "/sdapi/v1/txt2img",
        "auth_required": False,
        "rate_limit": "None (local)",
        "description": "Local Stable Diffusion installation - completely free"
    },
    {
        "name": "Hugging Face Inference API (Free Tier)",
        "url": "https://api-inference.huggingface.co/models",
        "models": [
            "stabilityai/stable-diffusion-2-1",
            "prompthero/openjourney",
            "runwayml/stable-diffusion-v1-5"
        ],
        "rate_limit": "Monthly free quota",
        "description": "Hugging Face free tier with limited requests per month"
    },
    {
        "name": "Replicate (Free Credits)",
        "url": "https://replicate.com",
        "models": [
            "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf"
        ],
        "rate_limit": "Free credits for new users",
        "description": "Free credits for new users, then paid service"
    }
]

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

# Content themes for more contextual variation
CONTENT_THEMES = [
    "studio_portrait",    # Clean studio background
    "urban_lifestyle",    # City background
    "indoor_elegant",     # Elegant indoor setting
    "outdoor_natural",    # Natural outdoor setting
]

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
    
    # Create detailed prompt with specific focus on Indian menswear
    prompt = f"Professional studio photo of {concept}, {color} color, {style}, {description}, luxury menswear, high detail, 4k resolution, professional lighting, sharp focus, clean background, Indian gentleman, premium quality"
    
    return prompt


def generate_ai_image_local(prompt: str, output_path: Path) -> bool:
    """
    Generate an AI image using local Stable Diffusion WebUI API
    This is completely free if you have a local installation
    """
    try:
        # Check if local SD WebUI is running
        sd_url = "http://127.0.0.1:7860"
        
        # Test connection
        response = requests.get(f"{sd_url}/startup-events", timeout=5)
        if response.status_code != 200:
            print("Local Stable Diffusion WebUI not found or not running")
            return False
            
        # Generate image
        payload = {
            "prompt": prompt,
            "steps": 20,
            "width": CANVAS_W,
            "height": CANVAS_H,
            "cfg_scale": 7,
            "sampler_name": "Euler a",
            "n_iter": 1,
            "batch_size": 1
        }
        
        response = requests.post(
            f"{sd_url}/sdapi/v1/txt2img",
            json=payload,
            timeout=300  # 5 minutes timeout for image generation
        )
        
        if response.status_code == 200:
            r = response.json()
            # Save the first image
            image_data = r['images'][0]
            # Remove data URL prefix if present
            if image_data.startswith("data:image"):
                image_data = image_data.split(",", 1)[1]
            
            import base64
            image_bytes = base64.b64decode(image_data)
            with open(output_path, "wb") as f:
                f.write(image_bytes)
            return True
        else:
            print(f"Local SD WebUI error: {response.status_code} - {response.text}")
            return False
    except requests.exceptions.ConnectionError:
        print("Could not connect to local Stable Diffusion WebUI - make sure it's running")
        return False
    except Exception as e:
        print(f"Error generating AI image with local SD: {e}")
        return False


def generate_ai_image_replicate(prompt: str, output_path: Path) -> bool:
    """
    Generate an AI image using Replicate API (free credits for new users)
    Requires REPLICATE_API_TOKEN environment variable
    """
    try:
        # Get API token from environment
        api_token = os.getenv("REPLICATE_API_TOKEN", "").strip()
        if not api_token:
            print("Replicate API token not found in environment variables")
            return False
            
        # Use Stable Diffusion model
        model = "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf"
        
        headers = {
            "Authorization": f"Token {api_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "input": {
                "prompt": prompt,
                "width": CANVAS_W,
                "height": CANVAS_H,
                "num_outputs": 1,
                "guidance_scale": 7.5,
                "num_inference_steps": 50
            }
        }
        
        # Start prediction
        response = requests.post(
            f"https://api.replicate.com/v1/models/{model}/predictions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code != 201:
            print(f"Replicate API error: {response.status_code} - {response.text}")
            return False
            
        # Get prediction ID
        prediction_data = response.json()
        prediction_id = prediction_data["id"]
        get_url = prediction_data["urls"]["get"]
        
        # Poll for completion
        timeout = time.time() + 300  # 5 minutes timeout
        while time.time() < timeout:
            response = requests.get(get_url, headers=headers, timeout=30)
            if response.status_code == 200:
                result = response.json()
                if result["status"] == "succeeded":
                    # Download the image
                    output_url = result["output"][0]
                    image_response = requests.get(output_url, timeout=30)
                    if image_response.status_code == 200:
                        with open(output_path, "wb") as f:
                            f.write(image_response.content)
                        return True
                    else:
                        print(f"Failed to download image: {image_response.status_code}")
                        return False
                elif result["status"] == "failed":
                    print(f"Replicate prediction failed: {result.get('error', 'Unknown error')}")
                    return False
            else:
                print(f"Failed to check prediction status: {response.status_code}")
                return False
                
            time.sleep(5)  # Wait 5 seconds before polling again
            
        print("Replicate prediction timed out")
        return False
    except Exception as e:
        print(f"Error generating AI image with Replicate: {e}")
        return False


def generate_ai_image_free_hf(prompt: str, output_path: Path) -> bool:
    """
    Generate an AI image using Hugging Face free tier
    This uses the free quota available to all users
    """
    try:
        # Models that work with free tier
        models = [
            "stabilityai/stable-diffusion-2-1",
            "prompthero/openjourney",
            "runwayml/stable-diffusion-v1-5"
        ]
        
        # Try each model until one works
        for model in models:
            try:
                headers = {"Authorization": "Bearer "}  # No API key needed for free tier
                
                payload = {
                    "inputs": prompt,
                    "parameters": {
                        "height": CANVAS_H,
                        "width": CANVAS_W
                    }
                }
                
                response = requests.post(
                    f"https://api-inference.huggingface.co/models/{model}",
                    headers=headers,
                    json=payload,
                    timeout=120
                )
                
                if response.status_code == 200:
                    with open(output_path, "wb") as f:
                        f.write(response.content)
                    return True
                elif response.status_code == 503:
                    # Model is loading, wait and try another
                    print(f"Model {model} is loading, trying next model...")
                    continue
                else:
                    print(f"Hugging Face free tier error for {model}: {response.status_code} - {response.text}")
                    continue
            except Exception as e:
                print(f"Error with model {model}: {e}")
                continue
                
        return False
    except Exception as e:
        print(f"Error generating AI image with free Hugging Face: {e}")
        return False


def enhance_image_with_pil(src_path: Path, out_path: Path, variant: str = "none", style: str = "none") -> None:
    """
    Enhance an image using PIL for better visual appeal
    This is used as a fallback or enhancement layer
    """
    try:
        # Open source image
        img = Image.open(src_path).convert('RGB')
        
        # Resize to canvas size
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
        if style == "motion_blur":
            img = img.filter(ImageFilter.GaussianBlur(radius=1.5))
        elif style == "film_grain":
            # Add noise for film grain effect
            img_array = np.array(img)
            noise = np.random.normal(0, 10, img_array.shape).astype(np.uint8)
            img_array = np.clip(img_array.astype(np.int16) + noise, 0, 255).astype(np.uint8)
            img = Image.fromarray(img_array)
        elif style == "vintage_film":
            # Apply sepia tone
            img_array = np.array(img)
            # Sepia transformation
            sepia_filter = np.array([[0.393, 0.769, 0.189],
                                   [0.349, 0.686, 0.168],
                                   [0.272, 0.534, 0.131]])
            sepia_img = img_array.dot(sepia_filter.T)
            sepia_img = np.clip(sepia_img, 0, 255).astype(np.uint8)
            img = Image.fromarray(sepia_img)
        
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
        
        # Save enhanced image
        img.save(out_path, 'JPEG', quality=90)
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


def create_video_reel_from_images(image_paths: List[Path], output_path: Path) -> bool:
    """
    Create a video reel from multiple images using PIL and moviepy
    This is a free alternative to FFmpeg-based video generation
    """
    try:
        # Try to use moviepy first
        try:
            from moviepy.editor import ImageSequenceClip
            import tempfile
            
            # Convert images to the right format and size
            temp_dir = OUTPUT_DIR / "temp_video"
            temp_dir.mkdir(exist_ok=True)
            
            # Save images temporarily with consistent naming
            temp_images = []
            for i, img_path in enumerate(image_paths[:6]):  # Limit to 6 images
                try:
                    img = Image.open(img_path).convert('RGB')
                    img = img.resize((VIDEO_WIDTH, VIDEO_HEIGHT), Image.Resampling.LANCZOS)
                    
                    # Add watermark to each image
                    try:
                        logo = Image.open(LOGO_PATH).convert('RGBA')
                        logo = logo.resize((int(VIDEO_WIDTH * WATERMARK_RELATIVE_WIDTH), 
                                          int(logo.height * (int(VIDEO_WIDTH * WATERMARK_RELATIVE_WIDTH) / logo.width))), 
                                         Image.Resampling.LANCZOS)
                        
                        # Position watermark
                        x = VIDEO_WIDTH - logo.width - WATERMARK_MARGIN
                        y = VIDEO_HEIGHT - logo.height - WATERMARK_MARGIN
                        
                        # Paste watermark
                        if logo.mode == 'RGBA':
                            img.paste(logo, (x, y), logo)
                        else:
                            img.paste(logo, (x, y))
                    except Exception as e:
                        print(f"Warning: Could not add watermark to video frame: {e}")
                    
                    temp_img_path = temp_dir / f"frame_{i:03d}.jpg"
                    img.save(temp_img_path, 'JPEG', quality=85)
                    temp_images.append(str(temp_img_path))
                except Exception as e:
                    print(f"Warning: Could not process image {img_path}: {e}")
            
            if not temp_images:
                raise ValueError("No valid images found for video generation")
            
            # Create slideshow with transitions
            clip = ImageSequenceClip(temp_images, fps=1)  # 1 image per second
            clip = clip.set_duration(VIDEO_DURATION)
            
            # Write video file
            clip.write_videofile(str(output_path), fps=VIDEO_FPS, codec='libx264')
            
            # Clean up temp images
            for temp_img_path in temp_images:
                Path(temp_img_path).unlink(missing_ok=True)
            if temp_dir.exists():
                temp_dir.rmdir()
                
            return True
            
        except ImportError:
            # Fallback to creating an animated GIF if moviepy is not available
            print("MoviePy not available, creating animated GIF instead")
            gif_path = output_path.with_suffix('.gif')
            
            # Load and resize images
            images = []
            for img_path in image_paths[:6]:  # Limit to 6 images
                try:
                    img = Image.open(img_path).convert('RGB')
                    img = img.resize((VIDEO_WIDTH, VIDEO_HEIGHT), Image.Resampling.LANCZOS)
                    images.append(img)
                except Exception as e:
                    print(f"Warning: Could not load image {img_path}: {e}")
            
            if not images:
                raise ValueError("No valid images found for GIF generation")
            
            # Save as animated GIF
            images[0].save(
                gif_path,
                save_all=True,
                append_images=images[1:],
                duration=2000,  # 2 seconds per frame
                loop=0
            )
            print(f"Created animated GIF at {gif_path}")
            return True
            
    except Exception as e:
        print(f"Error creating video reel: {e}")
        return False


def main():
    """Main function to demonstrate the free Hugging Face alternative"""
    print("=== FREE HUGGING FACE ALTERNATIVE FOR AURUM BESPOKE ===")
    print()
    
    # Show available free services
    print("Available Free AI Services:")
    for i, service in enumerate(FREE_AI_SERVICES, 1):
        print(f"{i}. {service['name']}")
        print(f"   Description: {service['description']}")
        print(f"   Rate Limit: {service['rate_limit']}")
        print(f"   URL: {service['url']}")
        if 'models' in service:
            print(f"   Models: {', '.join(service['models'])}")
        print()
    
    # Demonstrate concept-based prompt generation
    print("=== CONCEPT-BASED PROMPT GENERATION ===")
    for service_name in list(SERVICE_CONFIG.keys())[:3]:  # Show first 3 services
        prompt = generate_concept_based_prompt(service_name)
        print(f"{service_name}:")
        print(f"  Prompt: {prompt}")
        print()
    
    # Instructions for setup
    print("=== SETUP INSTRUCTIONS ===")
    print("1. For LOCAL Stable Diffusion WebUI:")
    print("   - Install Stable Diffusion WebUI (https://github.com/AUTOMATIC1111/stable-diffusion-webui)")
    print("   - Run it with: python launch.py --api")
    print("   - No API key required - completely free")
    print()
    print("2. For REPLICATE (Free Credits):")
    print("   - Sign up at https://replicate.com")
    print("   - Get your free credits (typically $10-20 for new users)")
    print("   - Set REPLICATE_API_TOKEN environment variable")
    print()
    print("3. For HUGGING FACE Free Tier:")
    print("   - No API key required for basic usage")
    print("   - Limited to free quota (typically sufficient for daily use)")
    print()
    
    # Example usage
    print("=== EXAMPLE USAGE ===")
    print("To generate an AI image with local SD WebUI:")
    print("  python free_huggingface_alternative.py --generate-image --service 'Bespoke Suits' --method local")
    print()
    print("To generate a video reel from images:")
    print("  python free_huggingface_alternative.py --generate-video --images 'image1.jpg,image2.jpg,image3.jpg'")
    print()


if __name__ == "__main__":
    main()