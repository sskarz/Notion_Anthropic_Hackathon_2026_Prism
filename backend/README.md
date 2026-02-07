# Prism Backend — Voice Interview Agent

AI voice agent that conducts product feedback interviews over a real-time audio call. A user joins a room, and talks to an AI interviewer named Prism.

## How It Works

The agent uses LiveKit to create a real-time audio room. When a user connects, the full voice pipeline runs automatically:

```
User speaks → VAD detects speech → STT transcribes → Claude generates response → TTS synthesizes audio → User hears reply
```

| Component | Service | Role |
|-----------|---------|------|
| VAD | Silero (local) | Detects when the user is speaking vs. silence |
| Turn Detection | Multilingual model (local) | Predicts when the user is done talking |
| STT | Cartesia Ink Whisper | Transcribes speech to text in real-time |
| LLM | Claude Sonnet | Generates conversational interview responses |
| TTS | Cartesia Sonic 2 | Converts text responses back to speech |

The VAD and turn detector run locally as small ONNX models for instant response. Everything else runs via APIs.

## Setup

### Prerequisites

- Python 3.13 (3.14 is not yet supported by LiveKit)
- A [LiveKit Cloud](https://cloud.livekit.io/) account
- A [Cartesia](https://cartesia.ai/) API key
- An [Anthropic](https://console.anthropic.com/) API key

### 1. Create a virtual environment

```bash
cd backend
uv venv --python 3.13
source .venv/bin/activate
```

### 2. Install dependencies

```bash
cd voice_livekit
pip install -r requirements.txt
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your keys:

```
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
CARTESIA_API_KEY=your-cartesia-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 4. Download local models

```bash
python agent.py download-files
```

This downloads the Silero VAD and turn detector ONNX models (~few MB).

### 5. Run the agent

```bash
cd voice_livekit
python agent.py dev
```

### 6. Run the token server

The token server generates LiveKit access tokens so the frontend can join rooms.

```bash
cd backend
python token_server.py
```

This starts a FastAPI server on `http://localhost:8080` with the following endpoints:

```
GET  /api/token?room=<room-name>&identity=<user-name>
POST /api/signup
POST /api/analyze-transcript
```

- **`GET /api/token`** — Returns `{ "token": "<jwt>", "url": "<livekit-url>" }` for LiveKit room auth.
- **`POST /api/signup`** — Saves participant sign-up info to `backend/signups/` as markdown files.
- **`POST /api/analyze-transcript`** — Accepts a JSON body `{ "transcript": [{ "speaker": "user"|"agent", "text": "...", "timestamp": 0 }] }`, sends it to Claude Sonnet for analysis, and returns `{ "analysis": "<markdown>" }` with a structured report containing user persona, prioritized product issues (P0/P1/P2), direct quotes, and summary.

### 7. Test it

Open the Prism frontend (`npm run dev` in `frontend/`), navigate to the IDE view, and click **Start Interview** in the center panel. The frontend connects to the LiveKit room and the agent joins automatically.

Alternatively, use the [LiveKit Agents Playground](https://agents-playground.livekit.io/) to test the agent directly.

## File Structure

```
backend/
  token_server.py     # FastAPI server: token endpoint, signup, transcript analysis (port 8080)
  signups/            # Saved participant sign-up markdown files (gitignored)
  voice_livekit/
    agent.py          # Agent definition, system prompt, pipeline wiring
    requirements.txt  # Python dependencies
    .env              # API keys (not committed)
    .env.example      # Template for .env
```
