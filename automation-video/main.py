#!/usr/bin/env python3
"""
Aurum Bespoke Video Automation System
Generates and posts branded videos to Telegram with AI-generated content.
"""

import os
import sys
import json
import random
import time
import datetime as dt
import requests
import subprocess
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Set
import logging

# Import config
from config import *

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class VideoAutomation:
    def __init__(self):
        self.state = self.load_state()
        self.buckets = self.load_buckets()
        self.setup_directories()
        
    def setup_directories(self):
        """Create necessary directories"""
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        TEMP_DIR.mkdir(parents=True, exist_ok=True)
        
    def load_state(self) -> Dict:
        """Load automation state"""
        if STATE_PATH.exists():
            try:
                with open(STATE_PATH, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading state: {e}")
                return {}
        return self.get_default_state()
    
    def get_default_state(self) -> Dict:
        """Get default state structure"""
        return {
            "last_video_date": "",
            "count_today": 0,
            "last_slno": 0,
            "used_services_today": [],
            "used_videos": [],
            "last_rotation": 0
        }
    
    def load_buckets(self) -> Dict:
        """Load content buckets"""
        if BUCKETS_PATH.exists():
            try:
                with open(BUCKETS_PATH, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading buckets: {e}")
                return {}
        return self.get_default_buckets()
    
    def get_default_buckets(self) -> Dict:
        """Get default content buckets"""
        return {
            "services": ["Suit", "Sherwani", "Tuxedo", "Bandgala", "Pathani", "Modi Jacket"],
            "styles": ["Classic", "Modern", "Traditional", "Contemporary"],
            "occasions": ["Wedding", "Business", "Festival", "Party", "Formal"],
            "emotions": ["Confident", "Elegant", "Powerful", "Sophisticated"]
        }
    
    def save_state(self):
        """Save state atomically"""
        temp_path = STATE_PATH.with_suffix('.tmp')
        try:
            with open(temp_path, "w", encoding="utf-8") as f:
                json.dump(self.state, f, indent=2)
            temp_path.replace(STATE_PATH)
        except Exception as e:
            logger.error(f"Error saving state: {e}")
            if temp_path.exists():
                temp_path.unlink()
    
    def check_daily_reset(self):
        """Reset daily counters at IST midnight"""
        now_utc = dt.datetime.utcnow()
        ist = now_utc + dt.timedelta(hours=5, minutes=30)
        today_str = ist.strftime("%Y-%m-%d")
        
        if self.state.get("last_video_date") != today_str:
            self.state["last_video_date"] = today_str
            self.state["count_today"] = 0
            self.state["used_services_today"] = []
            logger.info("Daily reset completed")
    
    def can_post_today(self) -> bool:
        """Check if we can post today"""
        return self.state.get("count_today", 0) < DAILY_VIDEO_LIMIT
    
    def get_next_slno(self) -> int:
        """Get next serial number"""
        next_slno = self.state.get("last_slno", 0) + 1
        if next_slno > 999:
            next_slno = 1
        return next_slno
    
    def choose_service_and_style(self) -> Tuple[str, str, str]:
        """Choose service, style, and occasion with rotation logic"""
        used_today = set(self.state.get("used_services_today", []))
        available_services = [s for s in self.buckets["services"] if s not in used_today]
        
        if not available_services:
            # Reset if all services used
            available_services = self.buckets["services"]
            self.state["used_services_today"] = []
        
        service = random.choice(available_services)
        style = random.choice(self.buckets["styles"])
        occasion = random.choice(self.buckets["occasions"])
        
        return service, style, occasion
    
    def generate_ai_story(self, service: str, style: str, occasion: str) -> str:
        """Generate story using OpenAI API"""
        try:
            prompt = f"""Create a compelling 20-second story for a luxury menswear brand video.
Service: {service}
Style: {style}
Occasion: {occasion}
Tone: Sophisticated, aspirational, confident
Length: 2-3 sentences, suitable for voiceover
Focus: The feeling of wearing bespoke clothing, the confidence it brings"""
            
            # For now, return a template story (replace with actual OpenAI API call)
            stories = [
                f"Step into the world of {service} perfection. Every stitch tells a story of craftsmanship, every detail speaks of luxury. When you wear {service}, you don't just dress—you transform.",
                f"The {style} {service} is more than clothing—it's armor for the modern gentleman. Designed for {occasion}, crafted for confidence. This is where style meets substance.",
                f"From {occasion} to everyday elegance, the {service} redefines what it means to be well-dressed. Because true luxury isn't just seen—it's felt, lived, and remembered."
            ]
            return random.choice(stories)
            
        except Exception as e:
            logger.error(f"Error generating AI story: {e}")
            return f"Experience the luxury of {service}. Crafted with precision, designed for {style} elegance. Perfect for {occasion}."
    
    def generate_tts(self, text: str, output_path: Path) -> bool:
        """Generate TTS using ElevenLabs/PlayHT API"""
        try:
            # For now, use espeak as fallback (replace with actual TTS API)
            cmd = [
                "espeak", "-w", str(output_path),
                "--voice=en-us", "--speed=150",
                text
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            return result.returncode == 0
            
        except Exception as e:
            logger.error(f"Error generating TTS: {e}")
            return False
    
    def generate_ai_image(self, prompt: str, output_path: Path) -> bool:
        """Generate AI image using Leonardo/Hailuo API"""
        try:
            # For now, create a placeholder (replace with actual API call)
            # This would integrate with Leonardo AI or Hailuo for image generation
            logger.info(f"Would generate AI image: {prompt}")
            
            # Create a simple colored rectangle as placeholder
            cmd = [
                "ffmpeg", "-y", "-f", "lavfi",
                "-i", f"color=black:size={VIDEO_WIDTH}x{VIDEO_HEIGHT}",
                "-vf", "drawtext=text='AI Image Placeholder':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2",
                "-frames:v", "1", str(output_path)
            ]
            result = subprocess.run(cmd, capture_output=True)
            return result.returncode == 0
            
        except Exception as e:
            logger.error(f"Error generating AI image: {e}")
            return False
    
    def compose_video(self, image_path: Path, audio_path: Path, output_path: Path) -> bool:
        """Compose final video using FFmpeg"""
        try:
            # Video composition with watermark
            watermark_path = OVERLAY_PATH
            if not watermark_path.exists():
                logger.warning("Watermark not found, creating without it")
                watermark_cmd = ""
            else:
                watermark_cmd = f"[1:v]scale=200:-1[wm];[0:v][wm]overlay=W-w-20:H-h-20"
            
            if watermark_cmd:
                filter_complex = f"[0:v]scale={VIDEO_WIDTH}:{VIDEO_HEIGHT}:force_original_aspect_ratio=increase,crop={VIDEO_WIDTH}:{VIDEO_HEIGHT}[base];{watermark_cmd}"
                cmd = [
                    "ffmpeg", "-y", "-loglevel", "error",
                    "-i", str(image_path),
                    "-i", str(watermark_path),
                    "-i", str(audio_path),
                    "-filter_complex", filter_complex,
                    "-c:v", "libx264", "-preset", "medium", "-crf", "23",
                    "-c:a", "aac", "-b:a", "128k",
                    "-r", str(VIDEO_FPS), "-t", str(VIDEO_DURATION),
                    "-movflags", "+faststart",
                    str(output_path)
                ]
            else:
                cmd = [
                    "ffmpeg", "-y", "-loglevel", "error",
                    "-i", str(image_path),
                    "-i", str(audio_path),
                    "-vf", f"scale={VIDEO_WIDTH}:{VIDEO_HEIGHT}:force_original_aspect_ratio=increase,crop={VIDEO_WIDTH}:{VIDEO_HEIGHT}",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "23",
                    "-c:a", "aac", "-b:a", "128k",
                    "-r", str(VIDEO_FPS), "-t", str(VIDEO_DURATION),
                    "-movflags", "+faststart",
                    str(output_path)
                ]
            
            result = subprocess.run(cmd, capture_output=True)
            return result.returncode == 0
            
        except Exception as e:
            logger.error(f"Error composing video: {e}")
            return False
    
    def generate_hashtags(self) -> str:
        """Generate relevant hashtags"""
        try:
            with open(HASHTAG_BANK_PATH, "r", encoding="utf-8") as f:
                hashtags = f.read().strip().split("\n")
            
            # Select relevant hashtags
            selected = random.sample(hashtags, min(15, len(hashtags)))
            return " ".join(selected)
            
        except Exception as e:
            logger.error(f"Error loading hashtags: {e}")
            return "#AurumBespoke #LuxuryMenswear #Bespoke #Tailoring #Bangalore"
    
    def create_caption(self, service: str, slno: int, hashtags: str) -> str:
        """Create video caption"""
        return f"""🎬 Aurum Bespoke | {service}
SL No: {slno:03d}

✨ Luxury tailoring that transforms your confidence
🎯 Perfect fit, perfect style, perfect you

📱 Book Your Home Visit
WhatsApp: +91 81055 08503
Website: www.aurumbespoke.com

@aurum.bespoke

{hashtags}"""
    
    def send_to_telegram(self, video_path: Path, caption: str) -> bool:
        """Send video to Telegram"""
        try:
            if not TELEGRAM_TOKEN or not TELEGRAM_CHAT_ID:
                raise RuntimeError("Telegram credentials not configured")
            
            url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendVideo"
            
            for attempt in range(3):
                try:
                    with open(video_path, "rb") as f:
                        files = {"video": f}
                        data = {
                            "chat_id": TELEGRAM_CHAT_ID,
                            "caption": caption,
                            "supports_streaming": True
                        }
                        resp = requests.post(url, data=data, files=files, timeout=120)
                        
                        if resp.status_code == 200:
                            logger.info("Video sent successfully to Telegram")
                            return True
                        
                        err = f"Telegram API error: {resp.status_code} {resp.text}"
                        logger.error(err)
                        
                        if attempt == 2:
                            raise RuntimeError(err)
                            
                except Exception as e:
                    if attempt == 2:
                        raise
                    time.sleep(2 ** attempt)
            
            return False
            
        except Exception as e:
            logger.error(f"Error sending to Telegram: {e}")
            return False
    
    def cleanup_temp_files(self):
        """Clean up temporary files"""
        try:
            for temp_file in TEMP_DIR.glob("*"):
                if temp_file.is_file():
                    temp_file.unlink()
            logger.info("Temporary files cleaned up")
        except Exception as e:
            logger.error(f"Error cleaning up temp files: {e}")
    
    def run(self) -> bool:
        """Main automation run"""
        try:
            logger.info("Starting video automation")
            
            # Check daily limits
            self.check_daily_reset()
            if not self.can_post_today():
                logger.info("Daily video limit reached")
                return True
            
            # Get next serial number
            slno = self.get_next_slno()
            
            # Choose content
            service, style, occasion = self.choose_service_and_style()
            logger.info(f"Selected: {service} - {style} - {occasion}")
            
            # Generate AI content
            story = self.generate_ai_story(service, style, occasion)
            logger.info(f"Generated story: {story}")
            
            # Create temporary files
            temp_image = TEMP_DIR / f"temp_image_{slno}.jpg"
            temp_audio = TEMP_DIR / f"temp_audio_{slno}.wav"
            temp_video = TEMP_DIR / f"temp_video_{slno}.mp4"
            final_video = OUTPUT_DIR / f"{slno:03d}_{service.replace(' ', '_').lower()}.mp4"
            
            # Generate TTS
            if not self.generate_tts(story, temp_audio):
                logger.error("Failed to generate TTS")
                return False
            
            # Generate AI image
            image_prompt = f"Luxury {service} in {style} style for {occasion}, sophisticated, high-end photography"
            if not self.generate_ai_image(image_prompt, temp_image):
                logger.error("Failed to generate AI image")
                return False
            
            # Compose video
            if not self.compose_video(temp_image, temp_audio, temp_video):
                logger.error("Failed to compose video")
                return False
            
            # Move to final location
            temp_video.rename(final_video)
            
            # Generate caption and hashtags
            hashtags = self.generate_hashtags()
            caption = self.create_caption(service, slno, hashtags)
            
            # Send to Telegram
            if not self.send_to_telegram(final_video, caption):
                logger.error("Failed to send to Telegram")
                return False
            
            # Update state
            self.state["last_slno"] = slno
            self.state["count_today"] = self.state.get("count_today", 0) + 1
            self.state["used_services_today"].append(service)
            self.state["used_videos"].append(str(final_video))
            
            # Keep only last 30 videos for uniqueness
            if len(self.state["used_videos"]) > 30:
                self.state["used_videos"] = self.state["used_videos"][-30:]
            
            self.save_state()
            
            logger.info(f"Video {slno} created and posted successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error in video automation: {e}")
            return False
        
        finally:
            self.cleanup_temp_files()

def main():
    """Main entry point"""
    try:
        automation = VideoAutomation()
        success = automation.run()
        return 0 if success else 1
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())