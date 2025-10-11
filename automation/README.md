# Aurum Bespoke Content Generation System

## Setup Instructions

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Set up your environment variables:
   - Copy `.env.example` to `.env`:
     ```
     cp .env.example .env
     ```
   - Edit `.env` and add your actual credentials

3. For full functionality, install FFmpeg:
   - Download from https://ffmpeg.org/download.html
   - Add to your system PATH

## Running the System

### For daily autonomous generation:
```
python generate_and_send_daily.py
```

### For PIL fallback (no FFmpeg required):
```
python generate_content_pil_fallback.py
```

### To set up autonomous scheduling:
```
python autonomous_scheduler.py
```

Or on Windows:
```
setup_autonomous_scheduler.bat
```

## Environment Variables

The system uses the following environment variables:

- `HUGGING_FACE_API_KEY`: Your Hugging Face API key for AI image generation
- `TELEGRAM_TOKEN`: Your Telegram bot token for sending content
- `TELEGRAM_CHAT_ID`: The chat ID where content should be sent

These should be stored in a `.env` file in this directory.