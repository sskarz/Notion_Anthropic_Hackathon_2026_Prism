import json
import os

from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentServer, AgentSession, Agent, inference
from livekit.plugins import cartesia, anthropic
from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))


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


class UserInterviewAgent(Agent):
    def __init__(self, user_context: dict) -> None:
        name = user_context.get("name", "there")
        company = user_context.get("company", "your company")
        problem = user_context.get("problem_description", "the issue you reported")
        steps = user_context.get("steps_to_reproduce", "")
        urgency = user_context.get("urgency", "medium")

        steps_section = (
            f"They provided these steps to reproduce: {steps}\n"
            if steps
            else ""
        )

        super().__init__(
            instructions=(
                f"You are a friendly, professional product feedback interviewer named Prism. "
                f"You are conducting a focused diagnostic interview with {name} from {company}.\n\n"
                f"They reported the following problem: {problem}\n"
                f"{steps_section}"
                f"They rated the urgency as: {urgency}\n\n"
                "Guidelines:\n"
                "- Acknowledge their reported issue and show you understand it\n"
                "- Ask clarifying questions to understand the full impact\n"
                "- Explore how often this issue occurs and who it affects\n"
                "- Ask about any workarounds they have tried\n"
                "- Keep your responses concise, 2 to 3 sentences max\n"
                "- Be conversational, curious, and empathetic\n"
                "- Do not use complex formatting, emojis, or special characters\n"
                "- If the user seems done, thank them and wrap up gracefully\n\n"
                "Interview flow:\n"
                "1. Acknowledge their problem and ask them to walk you through it\n"
                "2. Ask about the impact on their workflow\n"
                "3. Ask how frequently this occurs\n"
                "4. Ask about any workarounds they have found\n"
                "5. Ask if there is anything else they want to share\n"
                "6. Thank them for their time\n\n"
                "Stay flexible. If the user goes in an interesting direction, "
                "follow that thread instead of rigidly sticking to the script."
            ),
        )
        self.user_context = user_context


server = AgentServer()


@server.rtc_session()
async def entrypoint(ctx: agents.JobContext):
    session = AgentSession(
        stt=inference.STT(
            model="cartesia/ink-whisper",
            language="en",
            extra_kwargs={
                "min_volume": 0.1,
                "max_silence_duration_secs": 1.5,
            },
        ),
        llm=anthropic.LLM(
            model="claude-sonnet-4-5-20250929",
            temperature=0.7,
        ),
        tts=cartesia.TTS(
            model="sonic-2",
            voice="79a125e8-cd45-4c13-8a67-188112f4dd22",
        ),
        turn_detection=MultilingualModel(),
    )

    await ctx.connect()
    await ctx.wait_for_participant()

    # Read metadata from the first remote participant to determine role
    role = "pm"
    user_meta = {}
    for p in ctx.room.remote_participants.values():
        if p.metadata:
            try:
                user_meta = json.loads(p.metadata)
                role = user_meta.get("participant_type", "pm")
            except json.JSONDecodeError:
                pass
            break

    if role == "user":
        agent = UserInterviewAgent(user_meta)
        name = user_meta.get("name", "there")
        problem = user_meta.get("problem_description", "the issue you reported")
        greeting = (
            f"Greet {name} by name. Tell them you have reviewed the issue they reported "
            f"about: {problem}. Ask them to walk you through what happened in their own words."
        )
    else:
        agent = InterviewAgent()
        greeting = (
            "Greet the user warmly. Introduce yourself as Prism, a product feedback interviewer. "
            "Ask them what product or feature they have been using recently that they would like to talk about."
        )

    await session.start(
        room=ctx.room,
        agent=agent,
    )

    await session.generate_reply(instructions=greeting)


if __name__ == "__main__":
    agents.cli.run_app(server)
