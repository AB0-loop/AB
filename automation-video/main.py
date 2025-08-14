#!/usr/bin/env python3
"""
Aurum Bespoke Video Automation System - COST FREE VERSION
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
import shutil
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
        self.hashtag_rotation = self.load_hashtag_rotation()
        self.setup_directories()
        self.setup_watermark()
        
    def setup_directories(self):
        """Create necessary directories"""
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        TEMP_DIR.mkdir(parents=True, exist_ok=True)
        
    def setup_watermark(self):
        """Auto-setup watermark from existing logo if needed"""
        if not OVERLAY_PATH.exists() and FALLBACK_LOGO.exists():
            try:
                shutil.copy2(FALLBACK_LOGO, OVERLAY_PATH)
                logger.info("Watermark auto-copied from existing logo")
            except Exception as e:
                logger.error(f"Failed to copy watermark: {e}")
        
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
        return DEFAULT_BUCKETS
    
    def load_hashtag_rotation(self) -> List[str]:
        """Load hashtag rotation for sequential usage"""
        if HASHTAG_PERSISTENCE_FILE.exists():
            try:
                with open(HASHTAG_PERSISTENCE_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return data.get("current_rotation", [])
            except Exception as e:
                logger.error(f"Error loading hashtag rotation: {e}")
        
        # Initialize rotation
        rotation = AGGRESSIVE_HASHTAGS.copy()
        random.shuffle(rotation)
        self.save_hashtag_rotation(rotation)
        return rotation
    
    def save_hashtag_rotation(self, rotation: List[str]):
        """Save hashtag rotation state"""
        try:
            data = {"current_rotation": rotation, "last_updated": dt.datetime.now().isoformat()}
            with open(HASHTAG_PERSISTENCE_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving hashtag rotation: {e}")
    
    def get_next_hashtags(self, count: int = 15) -> str:
        """Get next hashtags in rotation order"""
        if not self.hashtag_rotation:
            # Reset rotation if empty
            self.hashtag_rotation = AGGRESSIVE_HASHTAGS.copy()
            random.shuffle(self.hashtag_rotation)
        
        # Take next batch
        selected = self.hashtag_rotation[:count]
        self.hashtag_rotation = self.hashtag_rotation[count:]
        
        # Save updated rotation
        self.save_hashtag_rotation(self.hashtag_rotation)
        
        return " ".join(selected)
    
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
        """Generate story using sophisticated templates"""
        try:
            # Sophisticated templates for luxury brand
            stories = [
                f"Step into the world of {service} perfection. Every stitch tells a story of craftsmanship, every detail speaks of luxury. When you wear {service}, you don't just dress—you transform.",
                f"The {style} {service} is more than clothing—it's armor for the modern gentleman. Designed for {occasion}, crafted for confidence. This is where style meets substance.",
                f"From {occasion} to everyday elegance, the {service} redefines what it means to be well-dressed. Because true luxury isn't just seen—it's felt, lived, and remembered.",
                f"Experience the {style} elegance of {service}. Crafted for {occasion}, designed for confidence. This is where luxury meets legacy.",
                f"The {service} represents more than fashion—it's a statement of sophistication. {style} design meets {occasion} excellence. This is Aurum Bespoke.",
                f"Discover the art of {service} mastery. Each {style} detail crafted for {occasion} perfection. This is bespoke luxury redefined.",
                f"The {service} embodies timeless {style} elegance. Designed for {occasion}, built for confidence. This is where legends are crafted."
            ]
            return random.choice(stories)
            
        except Exception as e:
            logger.error(f"Error generating AI story: {e}")
            return f"Experience the luxury of {service}. Crafted with precision, designed for {style} elegance. Perfect for {occasion}."
    
    def generate_tts(self, text: str, output_path: Path) -> bool:
        """Generate TTS using espeak (local, free)"""
        try:
            # Use espeak (local) - FREE and reliable
            cmd = [
                "espeak", "-w", str(output_path),
                f"--voice={ESPEAK_VOICE}", f"--speed={ESPEAK_SPEED}",
                text
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                logger.info("TTS generated using espeak")
                return True
            
            logger.error("TTS generation failed")
            return False
            
        except Exception as e:
            logger.error(f"Error generating TTS: {e}")
            return False
    
    def create_luxury_image(self, prompt: str, output_path: Path) -> bool:
        """Create luxury-style image using existing assets and FFmpeg"""
        try:
            # Create a sophisticated luxury background with the logo
            cmd = [
                "ffmpeg", "-y", "-f", "lavfi",
                "-i", f"color=black:size={VIDEO_WIDTH}x{VIDEO_HEIGHT}",
                "-i", str(FALLBACK_LOGO),
                "-filter_complex", f"[0:v][1:v]overlay=(W-w)/2:(H-h)/2,drawtext=text='{prompt[:40]}...':fontsize=36:fontcolor=white:x=(w-text_w)/2:y=80,drawtext=text='Aurum Bespoke':fontsize=48:fontcolor=#c99e67:x=(w-text_w)/2:y=120",
                "-frames:v", "1", str(output_path)
            ]
            result = subprocess.run(cmd, capture_output=True)
            if result.returncode == 0:
                logger.info("Luxury image created successfully")
                return True
            return False
        except Exception as e:
            logger.error(f"Luxury image creation failed: {e}")
            return False
    
    def compose_video(self, image_path: Path, audio_path: Path, output_path: Path) -> bool:
        """Compose final video using FFmpeg with watermark"""
        try:
            # Video composition with watermark
            watermark_path = OVERLAY_PATH
            if not watermark_path.exists():
                logger.warning("Watermark not found, creating without it")
                watermark_cmd = ""
            else:
                watermark_cmd = f"[1:v]scale={VIDEO_SETTINGS['watermark_size']}:-1[wm];[0:v][wm]overlay=W-w-{VIDEO_SETTINGS['watermark_margin']}:H-h-{VIDEO_SETTINGS['watermark_margin']}"
            
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
    
    def create_caption(self, service: str, slno: int, hashtags: str) -> str:
        """Create video caption with brand information"""
        return f"""🎬 {AURUM_BRAND} | {service}
SL No: {slno:03d}

✨ Luxury tailoring that transforms your confidence
🎯 Perfect fit, perfect style, perfect you

📱 Book Your Home Visit
WhatsApp: {AURUM_PHONE}
Website: {AURUM_SITE}

@aurum.bespoke

{hashtags}"""
    
    def send_to_telegram(self, video_path: Path, caption: str) -> bool:
        """Send video to Telegram using same credentials as photo automation"""
        try:
            # Use the same environment variables as photo automation
            telegram_token = os.getenv("TELEGRAM_TOKEN") or os.getenv("TELEGRAM_BOT_TOKEN")
            telegram_chat_id = os.getenv("TELEGRAM_ID") or os.getenv("TELEGRAM_CHAT_ID")
            
            if not telegram_token or not telegram_chat_id:
                raise RuntimeError("Telegram credentials not configured")
            
            url = f"https://api.telegram.org/bot{telegram_token}/sendVideo"
            
            for attempt in range(MAX_RETRIES):
                try:
                    with open(video_path, "rb") as f:
                        files = {"video": f}
                        data = {
                            "chat_id": telegram_chat_id,
                            "caption": caption,
                            "supports_streaming": True
                        }
                        resp = requests.post(url, data=data, files=files, timeout=TIMEOUT)
                        
                        if resp.status_code == 200:
                            logger.info("Video sent successfully to Telegram")
                            return True
                        
                        err = f"Telegram API error: {resp.status_code} {resp.text}"
                        logger.error(err)
                        
                        if attempt == MAX_RETRIES - 1:
                            raise RuntimeError(err)
                            
                except Exception as e:
                    if attempt == MAX_RETRIES - 1:
                        raise
                    time.sleep(RETRY_DELAY ** attempt)
            
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
        """Main automation run with timeout protection"""
        start_time = time.time()
        
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
            
            # Check timeout
            if time.time() - start_time > PER_OUTFIT_TIMEOUT:
                logger.error("Outfit timeout exceeded")
                return False
            
            # Generate AI content
            story = self.generate_ai_story(service, style, occasion)
            logger.info(f"Generated story: {story}")
            
            # Create temporary files
            temp_image = TEMP_DIR / f"temp_image_{slno}.jpg"
            temp_audio = TEMP_DIR / f"temp_audio_{slno}.wav"
            temp_video = TEMP_DIR / f"temp_video_{slno}.mp4"
            final_video = OUTPUT_DIR / f"{slno:03d}_{service.replace(' ', '_').lower()}.mp4"
            
            # Check timeout
            if time.time() - start_time > PER_OUTFIT_TIMEOUT:
                logger.error("Outfit timeout exceeded")
                return False
            
            # Generate TTS
            if not self.generate_tts(story, temp_audio):
                logger.error("Failed to generate TTS")
                return False
            
            # Check timeout
            if time.time() - start_time > PER_OUTFIT_TIMEOUT:
                logger.error("Outfit timeout exceeded")
                return False
            
            # Generate luxury image
            image_prompt = f"Luxury {service} in {style} style for {occasion}, sophisticated, high-end photography"
            if not self.create_luxury_image(image_prompt, temp_image):
                logger.error("Failed to generate luxury image")
                return False
            
            # Check timeout
            if time.time() - start_time > PER_OUTFIT_TIMEOUT:
                logger.error("Outfit timeout exceeded")
                return False
            
            # Compose video
            if not self.compose_video(temp_image, temp_audio, temp_video):
                logger.error("Failed to compose video")
                return False
            
            # Move to final location
            temp_video.rename(final_video)
            
            # Generate caption and hashtags
            hashtags = self.get_next_hashtags(15)
            caption = self.create_caption(service, slno, hashtags)
            
            # Check timeout
            if time.time() - start_time > PER_OUTFIT_TIMEOUT:
                logger.error("Outfit timeout exceeded")
                return False
            
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