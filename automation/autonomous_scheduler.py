#!/usr/bin/env python3
"""
AUTONOMOUS SCHEDULER FOR AURUM BESPOKE
=====================================

This script schedules the daily content generation to run automatically at 6:00 AM IST every day.
"""

import schedule
import time
import subprocess
import sys
from datetime import datetime
import pytz

def run_daily_generation():
    """Run the daily content generation script"""
    print(f"[{datetime.now()}] Running daily content generation...")
    
    try:
        # Run the generation script
        result = subprocess.run([
            sys.executable, 
            "automation/generate_and_send_daily.py"
        ], capture_output=True, text=True, timeout=300)  # 5 minute timeout
        
        if result.returncode == 0:
            print(f"[{datetime.now()}] Daily generation completed successfully")
            print(f"Output: {result.stdout}")
        else:
            print(f"[{datetime.now()}] Daily generation failed with code {result.returncode}")
            print(f"Error: {result.stderr}")
            
    except subprocess.TimeoutExpired:
        print(f"[{datetime.now()}] Daily generation timed out")
    except Exception as e:
        print(f"[{datetime.now()}] Daily generation failed with exception: {e}")

def main():
    """Main scheduler function"""
    print("Aurum Bespoke Autonomous Scheduler Started")
    print("==========================================")
    print(f"Current time: {datetime.now()}")
    
    # Schedule the job to run at 6:00 AM IST every day (00:30 UTC)
    # Note: This requires the schedule library to be running continuously
    schedule.every().day.at("00:30").do(run_daily_generation)
    
    print("Scheduled daily generation for 6:00 AM IST")
    print("Scheduler is now running... Press Ctrl+C to stop")
    
    # Keep the scheduler running
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    main()