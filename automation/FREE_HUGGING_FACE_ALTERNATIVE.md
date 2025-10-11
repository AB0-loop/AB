# Free Hugging Face Alternative for Aurum Bespoke

This document explains how to set up and use free alternatives to the Hugging Face API for generating AI-enhanced content for the Aurum Bespoke project.

## Why Use Free Alternatives?

The original Hugging Face API key provided is invalid, and paid API usage can become expensive over time. These free alternatives offer similar functionality while keeping costs to zero.

## Available Free Alternatives

### 1. Local Stable Diffusion WebUI (Recommended)

**Pros:**
- Completely free after initial setup
- No rate limits
- Full control over the model
- High quality output

**Cons:**
- Requires powerful GPU (8GB+ VRAM recommended)
- Initial setup complexity

**Setup Instructions:**
1. Install Python 3.10 or later
2. Install Git
3. Clone the repository:
   ```bash
   git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
   cd stable-diffusion-webui
   ```
4. Download Stable Diffusion model files:
   - Download `v2-1_768-ema-pruned.ckpt` from Hugging Face
   - Place in `stable-diffusion-webui/models/Stable-diffusion/`
5. Run with API enabled:
   ```bash
   python launch.py --api --xformers --medvram
   ```
6. The API will be available at `http://127.0.0.1:7860`

### 2. Replicate (Free Credits)

**Pros:**
- No local hardware requirements
- Easy to set up
- Good quality output
- Free credits for new users ($10-20 typically)

**Cons:**
- Limited by free credits
- Internet connection required

**Setup Instructions:**
1. Sign up at [Replicate.com](https://replicate.com)
2. Get your API token from the dashboard
3. Set the environment variable:
   ```bash
   export REPLICATE_API_TOKEN=your_token_here
   # Windows: set REPLICATE_API_TOKEN=your_token_here
   ```
4. The system will automatically use your credits

### 3. Hugging Face Free Tier

**Pros:**
- No account required for basic usage
- No initial cost
- Multiple models available

**Cons:**
- Rate limited
- Queue times during high demand
- Lower priority than paid users

**Usage:**
- No setup required
- The system will automatically try free models when others fail

### 4. Enhanced Real Images (Fallback)

**Pros:**
- No external dependencies
- Always available
- Uses your actual product images
- No API costs

**Cons:**
- Less "AI-generated" look
- Limited variation

**Usage:**
- Automatic fallback when all AI services fail
- Applies filters and enhancements to real images

## Permissions Required

### For Local Stable Diffusion:
- **Hardware**: GPU with 8GB+ VRAM recommended
- **Software**: Python 3.10+, Git
- **Network**: None (completely offline)
- **Storage**: 10GB+ for model files

### For Replicate:
- **API Token**: From your Replicate account
- **Environment Variable**: `REPLICATE_API_TOKEN`
- **Network**: Internet access to Replicate API

### For Hugging Face Free Tier:
- **Network**: Internet access to Hugging Face API
- **Rate Limits**: Subject to free tier limitations

### For All Methods:
- **File System**: Read/write access to automation directory
- **Telegram**: Bot token and chat ID for content delivery

## Configuration

The system automatically tries these alternatives in order:

1. **Paid Hugging Face API** (if valid key provided)
2. **Local Stable Diffusion WebUI** (if running locally)
3. **Replicate** (if API token provided)
4. **Hugging Face Free Tier** (no credentials needed)
5. **Enhanced Real Images** (fallback)

## Usage Examples

### Test Local Stable Diffusion:
```bash
# Make sure SD WebUI is running with --api flag
curl http://127.0.0.1:7860/startup-events
```

### Set Replicate API Token:
```bash
# Linux/Mac
export REPLICATE_API_TOKEN=your_token_here

# Windows
set REPLICATE_API_TOKEN=your_token_here
```

### Run Daily Content Generation:
```bash
cd automation
python generate_and_send_daily.py
```

## Troubleshooting

### Local SD WebUI Not Detected:
- Ensure it's running with `--api` flag
- Check if the port is correct (default 7860)
- Verify firewall settings

### Replicate Not Working:
- Check API token validity
- Ensure environment variable is set correctly
- Verify internet connection

### No AI Generation Happening:
- The system falls back to enhanced real images
- This is normal and still produces quality content
- Check logs for specific error messages

## Cost Comparison

| Method | Initial Cost | Monthly Cost | Quality | Reliability |
|--------|--------------|--------------|---------|-------------|
| Paid Hugging Face | $0 | $9+ | High | High |
| Local Stable Diffusion | $500-2000 (GPU) | $0 | Very High | High |
| Replicate | $0 | $0-10 (free credits) | High | Medium |
| Hugging Face Free | $0 | $0 | Medium | Low |
| Enhanced Real Images | $0 | $0 | Medium | Very High |

## Recommendation

For the best long-term solution, we recommend:

1. **Short Term**: Use the enhanced real images fallback (already working)
2. **Medium Term**: Set up Replicate with free credits
3. **Long Term**: Install local Stable Diffusion WebUI for unlimited free generation

The current system gracefully handles all scenarios and will produce quality content regardless of which method is used.