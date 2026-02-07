# Voice Interview Agent — System Design

## Goal

Build an AI voice agent that conducts product feedback interviews over a real-time audio call. A user clicks a link, joins a room, and talks to an AI interviewer.

## Stack

- **LiveKit Agents Framework** — real-time audio room + agent pipeline orchestration
- **Cartesia Ink STT** — speech-to-text (via LiveKit plugin)
- **Claude Sonnet** — conversational LLM (via LiveKit Anthropic plugin)
- **Cartesia Sonic TTS** — text-to-speech (via LiveKit plugin)
- **Silero VAD** — voice activity detection (via LiveKit plugin)
- **Python** — agent server

## How It Works

LiveKit provides a real-time audio room that both the user (browser) and the agent (Python) join as participants. The LiveKit Agents Framework connects the full voice pipeline automatically: user speaks → VAD detects speech → STT transcribes → LLM generates response → TTS synthesizes audio → user hears reply. No custom audio routing code is needed.

## Architecture

User (browser) ↔ LiveKit Room ↔ Python Agent Server (VAD → Cartesia STT → Claude LLM → Cartesia TTS)

## Pipeline

1. User clicks a room link and joins the LiveKit room via browser
2. Agent detects the participant and plays a TTS greeting
3. User speaks
4. Silero VAD detects voice activity and filters silence
5. Cartesia Ink STT transcribes the audio in real-time
6. Transcript plus conversation history goes to Claude Sonnet (streaming)
7. Claude's streamed response goes to Cartesia Sonic TTS
8. TTS audio plays back to the user in the room
9. Repeat until the user leaves

Steps 4 through 8 are handled automatically by LiveKit's AgentSession. The developer only defines the agent's instructions and which plugins to use.

## Agent Behavior

The agent is a friendly, professional product feedback interviewer. It greets the user, asks open-ended questions about their experience, follows up on interesting points, and keeps responses concise (2-3 sentences). The system prompt defines persona, tone, and interview structure.

## File Structure

- **agent.py** — agent definition, system prompt, entrypoint, LiveKit AgentSession wiring
- **requirements.txt** — Python dependencies
- **.env** — API keys (not committed)

That's it. The entire MVP is one Python file plus config.

## Dependencies

Install via pip: livekit-agents with extras for anthropic, cartesia, silero, and turn-detector (version ~1.0), plus python-dotenv.

## Environment Variables

- LIVEKIT_URL — LiveKit Cloud WebSocket URL
- LIVEKIT_API_KEY — LiveKit API key
- LIVEKIT_API_SECRET — LiveKit API secret
- CARTESIA_API_KEY — Cartesia API key
- ANTHROPIC_API_KEY — Anthropic API key

## Running

Run the agent with the LiveKit CLI dev command. Then connect via the LiveKit Agents Playground (cloud.livekit.io/playground) to test — no frontend needed for MVP.

## Model Choices

- STT: Cartesia ink-whisper (fastest conversational STT)
- LLM: claude-sonnet-4-5-20250929 (fast, smart enough for interviews)
- TTS: Cartesia sonic-2 with a chosen voice ID from their library
- VAD: Silero (default LiveKit plugin, no config needed)

## Latency

Expected end-to-end latency from user finishing speaking to hearing the agent's first audio is under 1 second. Everything streams.