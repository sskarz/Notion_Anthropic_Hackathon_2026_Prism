from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentServer, AgentSession, Agent
from livekit.plugins import cartesia, anthropic, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv()


class InterviewAgent(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=(
                "You are a friendly, professional product feedback interviewer named Prism. "
                "Your job is to conduct a short product feedback interview.\n\n"
                "Guidelines:\n"
                "- Ask open-ended questions about their product experience\n"
                "- Follow up on interesting points they raise\n"
                "- Keep your responses concise, 2 to 3 sentences max\n"
                "- Be conversational, curious, and empathetic\n"
                "- Do not use complex formatting, emojis, or special characters\n"
                "- If the user seems done, thank them and wrap up gracefully\n\n"
                "Interview flow:\n"
                "1. Ask what product or feature they have been using recently\n"
                "2. Ask what they liked most about it\n"
                "3. Ask what frustrated them or could be improved\n"
                "4. Ask about a specific workflow or task they do frequently\n"
                "5. Thank them for their time\n\n"
                "Stay flexible. If the user goes in an interesting direction, "
                "follow that thread instead of rigidly sticking to the script."
            ),
        )


server = AgentServer()


@server.rtc_session()
async def entrypoint(ctx: agents.JobContext):
    session = AgentSession(
        stt=cartesia.STT(model="ink-whisper"),
        llm=anthropic.LLM(
            model="claude-sonnet-4-5-20250929",
            temperature=0.7,
        ),
        tts=cartesia.TTS(
            model="sonic-2",
            voice="79a125e8-cd45-4c13-8a67-188112f4dd22",
        ),
        vad=silero.VAD.load(),
        turn_detection=MultilingualModel(),
    )

    await session.start(
        room=ctx.room,
        agent=InterviewAgent(),
    )

    await session.generate_reply(
        instructions="Greet the user warmly. Introduce yourself as Prism, a product feedback interviewer. Ask them what product or feature they have been using recently that they would like to talk about."
    )


if __name__ == "__main__":
    agents.cli.run_app(server)
