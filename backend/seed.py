"""
Seed script for Notion Custom Agents PM research data.

Populates all 4 Notion databases (competitors, personas, quotes, issues)
with realistic PM research data for the Custom Agents team.

Usage: cd backend && python seed.py
"""

import asyncio
import sys

from models.persona import PersonaCreate
from models.quote import QuoteCreate
from models.issue import IssueCreate
from models.competitor import CompetitorCreate
from services.notion_writer import (
    create_persona,
    create_quote,
    create_issue,
    create_competitor,
)

# ---------------------------------------------------------------------------
# COMPETITORS
# ---------------------------------------------------------------------------

COMPETITORS: list[CompetitorCreate] = [
    CompetitorCreate(
        competitor_name="OpenAI Custom GPTs",
        website="https://openai.com/chatgpt#gpts",
        key_features="No-code GPT builder; browsing + code interpreter + DALL-E tools; GPT Store marketplace; file upload for knowledge base; shareable links",
        pricing="Included with ChatGPT Plus ($20/mo); Team plan $25/user/mo; Enterprise custom pricing",
        user_sentiment="Mixed",
    ),
    CompetitorCreate(
        competitor_name="Microsoft Copilot Studio",
        website="https://www.microsoft.com/en-us/copilot/microsoft-copilot-studio",
        key_features="Low-code agent builder; deep Microsoft 365 integration; Power Automate connectors; enterprise auth and DLP; Topics-based conversation design",
        pricing="$200/month per 25k messages; included in select M365 E plans",
        user_sentiment="Mixed",
    ),
    CompetitorCreate(
        competitor_name="Dust.tt",
        website="https://dust.tt",
        key_features="Multi-model agent framework; retrieval-augmented generation over company data; workspace-level data connectors (Notion, Slack, GitHub); fine-grained permissioning",
        pricing="Free tier for individuals; Pro $29/user/mo; Enterprise custom",
        user_sentiment="Positive",
    ),
    CompetitorCreate(
        competitor_name="Glean",
        website="https://www.glean.com",
        key_features="Enterprise search across 100+ SaaS apps; AI assistant for internal knowledge; people-aware relevance ranking; SSO and SCIM provisioning; analytics dashboard",
        pricing="Enterprise-only; custom pricing based on seat count and connectors",
        user_sentiment="Positive",
    ),
    CompetitorCreate(
        competitor_name="Zapier Central",
        website="https://central.zapier.com",
        key_features="AI bots with access to 7000+ app integrations; live data connections; teach-by-example behaviors; background automation; natural-language triggers",
        pricing="Free beta; expected to follow Zapier tiered pricing",
        user_sentiment="Mixed",
    ),
    CompetitorCreate(
        competitor_name="Relevance AI",
        website="https://relevanceai.com",
        key_features="No-code AI agent builder; multi-step tool chains; API and webhook triggers; vector-based knowledge retrieval; team collaboration features",
        pricing="Free tier with limits; Pro $199/mo; Scale $599/mo",
        user_sentiment="Positive",
    ),
    CompetitorCreate(
        competitor_name="CrewAI",
        website="https://www.crewai.com",
        key_features="Python framework for multi-agent orchestration; role-based agent design; sequential and hierarchical task delegation; LangChain-compatible tools; open-source core",
        pricing="Open-source (free); CrewAI+ hosted platform pricing TBD",
        user_sentiment="Positive",
    ),
    CompetitorCreate(
        competitor_name="LangGraph Agents",
        website="https://github.com/langchain-ai/langgraph",
        key_features="Stateful agent graphs with cycles; built on LangChain; checkpointing and human-in-the-loop; streaming support; LangSmith observability integration",
        pricing="Open-source (free); LangSmith observability $39/seat/mo",
        user_sentiment="Mixed",
    ),
]

# ---------------------------------------------------------------------------
# PERSONAS
# ---------------------------------------------------------------------------

PERSONAS: list[PersonaCreate] = [
    PersonaCreate(
        persona_type="Enterprise Knowledge Manager at Fortune 500",
        speaker_name="Rachel Torres",
        primary_use_case="Auto-triage support tickets and surface wiki answers from internal knowledge bases using Notion Custom Agents",
        communication_style="Analytical",
        goals="Reduce average ticket resolution time by 40%; decrease L1 support escalations; build self-serve knowledge retrieval for 10,000+ employees",
        constraints="Strict data governance and SOC2 requirements; complex permission hierarchies across 30+ departments; legacy content spread across Confluence, SharePoint, and Notion",
    ),
    PersonaCreate(
        persona_type="Startup Ops Lead at Series A SaaS",
        speaker_name="Marcus Chen",
        primary_use_case="Automate standups and sprint retrospectives from Notion databases",
        communication_style="Terse",
        goals="Eliminate 5 hrs/week of manual standup collection; auto-generate retro summaries; keep team aligned without more meetings",
        constraints="12-person team, tight budget; engineering-heavy culture skeptical of AI; data lives across Notion, Linear, and Slack",
    ),
    PersonaCreate(
        persona_type="Marketing Director at Mid-Market B2B",
        speaker_name="Aisha Patel",
        primary_use_case="Content calendar workflows and auto-drafted creative briefs powered by Notion Custom Agents",
        communication_style="Narrative",
        goals="Scale content output 3x without hiring; maintain brand voice consistency across channels; reduce brief-to-draft turnaround from 5 days to 1",
        constraints="Small team of 4 marketers; needs approval workflows before anything publishes; brand guidelines are nuanced and hard to codify",
    ),
    PersonaCreate(
        persona_type="Engineering Team Lead at Platform Company",
        speaker_name="David Kim",
        primary_use_case="RFC review automation and architecture decision record tracking with Custom Agents",
        communication_style="Terse",
        goals="Ensure all RFCs get reviewed within 48 hours; auto-tag relevant reviewers; maintain a searchable ADR repository with agent-generated summaries",
        constraints="Engineers distrust auto-generated technical content; need precise citations to source material; must integrate with GitHub PR workflows",
    ),
    PersonaCreate(
        persona_type="Customer Success Director at Enterprise SaaS",
        speaker_name="Jennifer Walsh",
        primary_use_case="Client onboarding playbooks and automated health score reports via Notion Custom Agents",
        communication_style="Verbose",
        goals="Standardize onboarding across 200+ enterprise accounts; reduce time-to-value from 90 to 45 days; generate weekly health score reports automatically; proactively flag at-risk accounts",
        constraints="Client data sensitivity requires strict access controls; CS team of 15 manages 200+ accounts; onboarding workflows vary significantly by client tier and industry vertical",
    ),
    PersonaCreate(
        persona_type="Product Designer at Design Agency",
        speaker_name="Liam Foster",
        primary_use_case="Design system documentation agent and component audit automation",
        communication_style="Analytical",
        goals="Keep design system docs always in sync with Figma; auto-audit component usage across projects; reduce design debt review time by 60%",
        constraints="Design tokens and specs change frequently; Figma is source of truth but Notion hosts documentation; need visual diff support that agents currently lack",
    ),
    PersonaCreate(
        persona_type="HR Operations Manager at Remote-First Company",
        speaker_name="Priya Sharma",
        primary_use_case="Employee handbook Q&A agent and policy change tracking with Notion Custom Agents",
        communication_style="Narrative",
        goals="Provide instant answers to policy questions across 5 time zones; auto-notify teams when policies update; reduce HR ticket volume by 50%",
        constraints="Policies differ by country (US, UK, Germany, India, Australia); sensitive employee data must be scoped carefully; handbook is 200+ pages and updated quarterly",
    ),
    PersonaCreate(
        persona_type="Agency Project Manager at Digital Consultancy",
        speaker_name="Tom Bradley",
        primary_use_case="Client deliverable tracking and SOW compliance checking using Custom Agents",
        communication_style="Analytical",
        goals="Auto-track deliverable status against SOW milestones; flag scope creep early; generate weekly client status reports from Notion project databases",
        constraints="Managing 8-12 concurrent client projects; each client has different SOW structures; need cross-workspace access that Notion doesn't currently support",
    ),
]

# ---------------------------------------------------------------------------
# QUOTES
# Each quote references a persona by index and optionally a competitor by name.
# ---------------------------------------------------------------------------

QUOTES: list[dict] = [
    # -- Persona 0: Enterprise Knowledge Manager --
    {
        "text": "We have 50,000 wiki pages across three platforms. The agent chokes after about 200 pages of context -- it just starts making things up.",
        "speaker": "Rachel Torres, Knowledge Manager",
        "sentiment": "Frustrated",
        "quote_type": "Pain Point",
        "persona_index": 0,
        "competitor_name": None,
    },
    {
        "text": "The in-workspace advantage is real. Our support team doesn't need to leave Notion to get answers, and adoption went from zero to 80% in two weeks.",
        "speaker": "Rachel Torres, Knowledge Manager",
        "sentiment": "Positive",
        "quote_type": "Praise",
        "persona_index": 0,
        "competitor_name": None,
    },
    {
        "text": "We evaluated Glean for enterprise search, but the fact that our team already lives in Notion made Custom Agents a much easier sell to leadership.",
        "speaker": "Rachel Torres, Knowledge Manager",
        "sentiment": "Positive",
        "quote_type": "Insight",
        "persona_index": 0,
        "competitor_name": "Glean",
    },
    {
        "text": "I need the agent to respect our department-level permissions. Right now it's all-or-nothing access to the knowledge base.",
        "speaker": "Rachel Torres, Knowledge Manager",
        "sentiment": "Frustrated",
        "quote_type": "Feature Request",
        "persona_index": 0,
        "competitor_name": None,
    },
    {
        "text": "When it works within the context window, the accuracy is genuinely impressive. Our L1 resolution rate jumped 35% in the first month.",
        "speaker": "Rachel Torres, Knowledge Manager",
        "sentiment": "Positive",
        "quote_type": "Praise",
        "persona_index": 0,
        "competitor_name": None,
    },

    # -- Persona 1: Startup Ops Lead --
    {
        "text": "Setup took 15 minutes. I pointed it at our sprint database and it started generating standups immediately. No engineering time needed.",
        "speaker": "Marcus Chen, Ops Lead",
        "sentiment": "Positive",
        "quote_type": "Praise",
        "persona_index": 1,
        "competitor_name": None,
    },
    {
        "text": "The retro summaries are decent but I can't schedule them. I have to manually trigger the agent every Friday, which defeats the purpose.",
        "speaker": "Marcus Chen, Ops Lead",
        "sentiment": "Frustrated",
        "quote_type": "Pain Point",
        "persona_index": 1,
        "competitor_name": None,
    },
    {
        "text": "Zapier Central can trigger automations on a schedule, but the AI part is way less capable than what Notion agents do with structured data.",
        "speaker": "Marcus Chen, Ops Lead",
        "sentiment": "Neutral",
        "quote_type": "Insight",
        "persona_index": 1,
        "competitor_name": "Zapier Central",
    },
    {
        "text": "We need multi-agent chaining. One agent to collect standup data, another to summarize, a third to post to Slack. Right now I can only do one step.",
        "speaker": "Marcus Chen, Ops Lead",
        "sentiment": "Neutral",
        "quote_type": "Feature Request",
        "persona_index": 1,
        "competitor_name": None,
    },
    {
        "text": "At $10/user/month for a 12-person startup, the per-seat pricing adds up fast when only 3 people actually configure agents.",
        "speaker": "Marcus Chen, Ops Lead",
        "sentiment": "Frustrated",
        "quote_type": "Pain Point",
        "persona_index": 1,
        "competitor_name": None,
    },

    # -- Persona 2: Marketing Director --
    {
        "text": "I built an agent that reads our content calendar and drafts briefs overnight. What used to take my team a full day now takes 20 minutes of review.",
        "speaker": "Aisha Patel, Marketing Director",
        "sentiment": "Positive",
        "quote_type": "Praise",
        "persona_index": 2,
        "competitor_name": None,
    },
    {
        "text": "The agent doesn't understand our brand voice yet. It writes like a generic AI -- we need a way to train it on our tone guidelines and past content.",
        "speaker": "Aisha Patel, Marketing Director",
        "sentiment": "Neutral",
        "quote_type": "Pain Point",
        "persona_index": 2,
        "competitor_name": None,
    },
    {
        "text": "We tried OpenAI Custom GPTs first but they can't access our Notion databases natively. Having the agent live where our data lives is a game-changer.",
        "speaker": "Aisha Patel, Marketing Director",
        "sentiment": "Positive",
        "quote_type": "Insight",
        "persona_index": 2,
        "competitor_name": "OpenAI Custom GPTs",
    },
    {
        "text": "I want an approval workflow so the agent's draft goes to me before it touches the content calendar. Right now there's no gate between generation and publication.",
        "speaker": "Aisha Patel, Marketing Director",
        "sentiment": "Neutral",
        "quote_type": "Feature Request",
        "persona_index": 2,
        "competitor_name": None,
    },
    {
        "text": "My team adopted it faster than any tool I've introduced in five years. The learning curve is basically zero because they already know Notion.",
        "speaker": "Aisha Patel, Marketing Director",
        "sentiment": "Positive",
        "quote_type": "Praise",
        "persona_index": 2,
        "competitor_name": None,
    },

    # -- Persona 3: Engineering Team Lead --
    {
        "text": "The agent summarizes RFCs well but I can't verify its reasoning. When it says 'this RFC conflicts with ADR-47', I need to see the receipts.",
        "speaker": "David Kim, Engineering Lead",
        "sentiment": "Neutral",
        "quote_type": "Pain Point",
        "persona_index": 3,
        "competitor_name": None,
    },
    {
        "text": "We need version history for agent configs. My team lead changed the system prompt and broke our RFC reviewer. No way to roll back.",
        "speaker": "David Kim, Engineering Lead",
        "sentiment": "Frustrated",
        "quote_type": "Feature Request",
        "persona_index": 3,
        "competitor_name": None,
    },
    {
        "text": "LangGraph gives us full control and observability but requires dedicated engineering time. Notion agents are 10x faster to set up for simple use cases.",
        "speaker": "David Kim, Engineering Lead",
        "sentiment": "Neutral",
        "quote_type": "Insight",
        "persona_index": 3,
        "competitor_name": "LangGraph Agents",
    },
    {
        "text": "There's no testing sandbox. I can't iterate on agent prompts without it firing against production data. Need a dry-run or preview mode.",
        "speaker": "David Kim, Engineering Lead",
        "sentiment": "Frustrated",
        "quote_type": "Pain Point",
        "persona_index": 3,
        "competitor_name": None,
    },
    {
        "text": "Integration with GitHub would be huge. If the agent could cross-reference PRs with RFCs in Notion, it would close a major workflow gap for us.",
        "speaker": "David Kim, Engineering Lead",
        "sentiment": "Neutral",
        "quote_type": "Feature Request",
        "persona_index": 3,
        "competitor_name": None,
    },

    # -- Persona 4: Customer Success Director --
    {
        "text": "We onboard 15-20 enterprise clients per quarter, each with different requirements. The agent generates customized playbooks from our template database in seconds -- it used to take a CSM half a day per client.",
        "speaker": "Jennifer Walsh, CS Director",
        "sentiment": "Positive",
        "quote_type": "Praise",
        "persona_index": 4,
        "competitor_name": None,
    },
    {
        "text": "The agent hallucinated a feature in a client onboarding doc that we don't actually offer. In a compliance-heavy industry, that's not just embarrassing -- it's a liability.",
        "speaker": "Jennifer Walsh, CS Director",
        "sentiment": "Negative",
        "quote_type": "Pain Point",
        "persona_index": 4,
        "competitor_name": None,
    },
    {
        "text": "I want the agent to pull CRM data from Salesforce alongside our Notion health scores. The picture is incomplete without external system integration.",
        "speaker": "Jennifer Walsh, CS Director",
        "sentiment": "Neutral",
        "quote_type": "Feature Request",
        "persona_index": 4,
        "competitor_name": None,
    },
    {
        "text": "Dust.tt lets us connect multiple data sources, but it's a separate tool our team has to learn. The Notion agent is right where we already work.",
        "speaker": "Jennifer Walsh, CS Director",
        "sentiment": "Neutral",
        "quote_type": "Insight",
        "persona_index": 4,
        "competitor_name": "Dust.tt",
    },
    {
        "text": "For large databases with 500+ client records, the agent takes 8-10 seconds to respond. That's too slow when a CSM is on a live call with a client.",
        "speaker": "Jennifer Walsh, CS Director",
        "sentiment": "Frustrated",
        "quote_type": "Pain Point",
        "persona_index": 4,
        "competitor_name": None,
    },

    # -- Persona 5: Product Designer --
    {
        "text": "The design system agent catches component inconsistencies that humans miss. It flagged 23 undocumented variants in our first audit run.",
        "speaker": "Liam Foster, Product Designer",
        "sentiment": "Positive",
        "quote_type": "Praise",
        "persona_index": 5,
        "competitor_name": None,
    },
    {
        "text": "Our unstructured design rationale docs produce garbage outputs. The agent needs structured properties to work well -- free-text pages are unreliable.",
        "speaker": "Liam Foster, Product Designer",
        "sentiment": "Frustrated",
        "quote_type": "Pain Point",
        "persona_index": 5,
        "competitor_name": None,
    },
    {
        "text": "I want agent output in clean markdown with tables and code blocks. Right now everything comes back as flat paragraphs, which doesn't work for spec docs.",
        "speaker": "Liam Foster, Product Designer",
        "sentiment": "Neutral",
        "quote_type": "Feature Request",
        "persona_index": 5,
        "competitor_name": None,
    },
    {
        "text": "Compared to Microsoft Copilot Studio, the Notion agent is refreshingly simple. No 'Topics' or dialog trees -- just point it at data and go.",
        "speaker": "Liam Foster, Product Designer",
        "sentiment": "Positive",
        "quote_type": "Insight",
        "persona_index": 5,
        "competitor_name": "Microsoft Copilot Studio",
    },
    {
        "text": "An agent template gallery would save us tons of time. Every design team needs a component audit agent -- why should each of us build it from scratch?",
        "speaker": "Liam Foster, Product Designer",
        "sentiment": "Neutral",
        "quote_type": "Feature Request",
        "persona_index": 5,
        "competitor_name": None,
    },

    # -- Persona 6: HR Operations Manager --
    {
        "text": "Our handbook Q&A agent handles 70% of routine HR questions now. People message it at 2 AM from different time zones and get instant answers instead of waiting for business hours.",
        "speaker": "Priya Sharma, HR Ops Manager",
        "sentiment": "Positive",
        "quote_type": "Praise",
        "persona_index": 6,
        "competitor_name": None,
    },
    {
        "text": "The agent can't distinguish between US and German leave policies. It mixes up jurisdiction-specific rules, which is dangerous for compliance.",
        "speaker": "Priya Sharma, HR Ops Manager",
        "sentiment": "Negative",
        "quote_type": "Pain Point",
        "persona_index": 6,
        "competitor_name": None,
    },
    {
        "text": "I need the agent to scope its answers based on the employee's location and department. Granular access controls are a must-have for HR use cases.",
        "speaker": "Priya Sharma, HR Ops Manager",
        "sentiment": "Neutral",
        "quote_type": "Feature Request",
        "persona_index": 6,
        "competitor_name": None,
    },
    {
        "text": "Relevance AI has more sophisticated retrieval pipelines, but it requires a technical person to set up. I could configure the Notion agent myself in an afternoon.",
        "speaker": "Priya Sharma, HR Ops Manager",
        "sentiment": "Neutral",
        "quote_type": "Insight",
        "persona_index": 6,
        "competitor_name": "Relevance AI",
    },
    {
        "text": "When we update a policy, there's no automatic notification to employees. I want the agent to proactively push change summaries to relevant teams.",
        "speaker": "Priya Sharma, HR Ops Manager",
        "sentiment": "Neutral",
        "quote_type": "Feature Request",
        "persona_index": 6,
        "competitor_name": None,
    },

    # -- Persona 7: Agency Project Manager --
    {
        "text": "The agent cross-references deliverables against SOW milestones automatically. It caught two instances of scope creep last month that would have cost us $40K.",
        "speaker": "Tom Bradley, Agency PM",
        "sentiment": "Positive",
        "quote_type": "Praise",
        "persona_index": 7,
        "competitor_name": None,
    },
    {
        "text": "We manage 10 client workspaces in Notion. The agent only works within a single workspace, so I need 10 separate configurations doing the same thing.",
        "speaker": "Tom Bradley, Agency PM",
        "sentiment": "Frustrated",
        "quote_type": "Pain Point",
        "persona_index": 7,
        "competitor_name": None,
    },
    {
        "text": "CrewAI lets you chain multiple agents for complex workflows, which is exactly what we need. But it requires Python expertise our PMs don't have.",
        "speaker": "Tom Bradley, Agency PM",
        "sentiment": "Neutral",
        "quote_type": "Insight",
        "persona_index": 7,
        "competitor_name": "CrewAI",
    },
    {
        "text": "I need the agent to generate weekly status reports and push them to Slack channels automatically. Right now it's query-response only.",
        "speaker": "Tom Bradley, Agency PM",
        "sentiment": "Neutral",
        "quote_type": "Feature Request",
        "persona_index": 7,
        "competitor_name": None,
    },
    {
        "text": "An analytics dashboard showing how often clients interact with the agent would help us prove ROI in quarterly business reviews.",
        "speaker": "Tom Bradley, Agency PM",
        "sentiment": "Neutral",
        "quote_type": "Feature Request",
        "persona_index": 7,
        "competitor_name": None,
    },

    # -- Unattributed quotes --
    {
        "text": "The pricing model needs a rethink. Charging per seat when only power users build agents feels unfair to teams exploring the feature.",
        "speaker": "Anonymous PM Survey Respondent",
        "sentiment": "Negative",
        "quote_type": "Pain Point",
        "persona_index": None,
        "competitor_name": None,
    },
    {
        "text": "Notion Custom Agents have the distribution advantage that no standalone AI tool can match. They're already embedded in how millions of people work.",
        "speaker": "Industry Analyst, Forrester",
        "sentiment": "Positive",
        "quote_type": "Insight",
        "persona_index": None,
        "competitor_name": None,
    },
]

# ---------------------------------------------------------------------------
# ISSUES
# Each issue references a persona by index and quotes by their indices in the
# QUOTES list above.
# ---------------------------------------------------------------------------

ISSUES: list[dict] = [
    # -- Critical --
    {
        "title": "Context window truncation silently drops knowledge base content",
        "type": "Pain Point",
        "details": "When a knowledge base exceeds the agent's context window (~200 pages), content is silently truncated without warning. Users report hallucinated answers that blend real content with fabricated details. Affects all enterprise users with large documentation sets. Need chunking strategy, retrieval-augmented generation, or at minimum a warning when content is truncated.",
        "severity": "Critical",
        "time": "Q4 2025",
        "graph_data": '{"labels":["<50 pages","50-100","100-200","200-500","500+"],"values":[2,5,18,31,44],"metric":"hallucination rate %"}',
        "persona_index": 0,
        "quote_indices": [0],
    },
    {
        "title": "Agent hallucination risk in compliance-sensitive contexts",
        "type": "Pain Point",
        "details": "Agents occasionally generate plausible but incorrect information when answering questions about technical specifications, compliance policies, or product features. In regulated industries (healthcare, finance, legal), this creates liability risk. Users need confidence scoring, source citations, or a 'verified facts only' mode.",
        "severity": "Critical",
        "time": "Q3 2025",
        "graph_data": '{"labels":["General Q&A","Technical Specs","Policy/Compliance","Product Features"],"values":[4,12,19,8],"metric":"hallucination incidents per 1000 queries"}',
        "persona_index": 4,
        "quote_indices": [21],
    },
    {
        "title": "No debugging or testing tools for agent configurations",
        "type": "Workflow Gap",
        "details": "Agent creators cannot test prompt changes without running against production data. No dry-run mode, no prompt playground, no diff view between configuration versions. Engineering teams report accidentally breaking agents by editing system prompts with no way to revert or preview changes.",
        "severity": "Critical",
        "time": "Q4 2025",
        "graph_data": '{"labels":["Jan","Feb","Mar","Apr","May","Jun"],"values":[3,5,8,14,19,27],"metric":"reported broken agent configs per month"}',
        "persona_index": 3,
        "quote_indices": [18],
    },
    {
        "title": "Data privacy concerns with broad agent database access",
        "type": "Pain Point",
        "details": "Agents currently have all-or-nothing access to connected databases. Organizations with sensitive data (HR records, financial data, client information) cannot scope agent permissions to specific views or filtered subsets. This blocks adoption in security-conscious enterprises and regulated industries.",
        "severity": "Critical",
        "time": "Q3 2025",
        "graph_data": '{"labels":["Blocked adoption","Using workarounds","Accepted risk","Not concerned"],"values":[38,27,22,13],"metric":"enterprise respondents %"}',
        "persona_index": 6,
        "quote_indices": [3, 32],
    },

    # -- High --
    {
        "title": "Cross-workspace agent access not supported",
        "type": "Workflow Gap",
        "details": "Agents are scoped to a single Notion workspace. Agencies and organizations managing multiple workspaces must duplicate agent configurations. No way to create a unified agent that queries across workspace boundaries, forcing workarounds and manual consolidation.",
        "severity": "High",
        "time": "Q4 2025",
        "graph_data": '{"labels":["1 workspace","2-3","4-6","7-10","10+"],"values":[34,28,19,12,7],"metric":"users by workspace count %"}',
        "persona_index": 7,
        "quote_indices": [36],
    },
    {
        "title": "Multi-agent chaining and orchestration not possible",
        "type": "Feature Request",
        "details": "Users cannot compose multiple agents into sequential or parallel workflows. Common requests include: Agent A collects data, Agent B analyzes it, Agent C distributes results. Currently each agent operates in isolation, forcing manual handoffs between steps.",
        "severity": "High",
        "time": "Q1 2026",
        "graph_data": '{"labels":["Single agent","2-agent chain","3+ agent chain","Parallel agents"],"values":[100,0,0,0],"metric":"supported workflow types"}',
        "persona_index": 1,
        "quote_indices": [8],
    },
    {
        "title": "Approval workflows for agent-generated content",
        "type": "Feature Request",
        "details": "No mechanism to require human approval before an agent's output is written to a database or page. Marketing, legal, and compliance teams need a review gate between agent generation and content publication to prevent errors from reaching customers or stakeholders.",
        "severity": "High",
        "time": "Q4 2025",
        "graph_data": '{"labels":["Marketing","Legal","CS","Engineering","HR"],"values":[89,94,72,45,81],"metric":"teams requiring approval gates %"}',
        "persona_index": 2,
        "quote_indices": [13],
    },
    {
        "title": "Granular access controls for agent database permissions",
        "type": "Feature Request",
        "details": "Agents need row-level and column-level access controls. HR agents should only see policies for the querying employee's jurisdiction. Client-facing agents should only access their specific project database. Current all-or-nothing model blocks adoption in permission-sensitive organizations.",
        "severity": "High",
        "time": "Q3 2025",
        "graph_data": '{"labels":["Full DB access","View-level","Row-level","Column-level"],"values":[100,0,0,0],"metric":"current vs requested permission granularity %"}',
        "persona_index": 0,
        "quote_indices": [3, 32],
    },
    {
        "title": "Scheduled and triggered agent execution",
        "type": "Feature Request",
        "details": "Agents currently operate in query-response mode only. Users need time-based schedules (daily standups, weekly reports) and event-based triggers (new database entry, status change, deadline approaching). This is table-stakes for workflow automation competitors.",
        "severity": "High",
        "time": "Q1 2026",
        "graph_data": '{"labels":["Daily schedule","Weekly schedule","On DB change","On status change","On deadline"],"values":[67,54,41,38,29],"metric":"requested trigger types (% of respondents)"}',
        "persona_index": 1,
        "quote_indices": [6],
    },
    {
        "title": "External system integration for CRM, GitHub, and Slack",
        "type": "Unmet Need",
        "details": "Agents cannot read from or write to systems outside Notion. Top requests: pull CRM data from Salesforce/HubSpot for health scores, cross-reference GitHub PRs with Notion RFCs, push agent outputs to Slack channels. Lack of integrations limits agents to Notion-only workflows.",
        "severity": "High",
        "time": "Q4 2025",
        "graph_data": '{"labels":["Slack","Salesforce","GitHub","HubSpot","Jira","Linear"],"values":[73,52,48,31,29,22],"metric":"requested integrations (% of respondents)"}',
        "persona_index": 4,
        "quote_indices": [22, 19],
    },
    {
        "title": "Agent response latency unacceptable for large databases",
        "type": "Pain Point",
        "details": "Agent responses take 8-10+ seconds when querying databases with 500+ records. This makes agents unusable during live customer calls or time-sensitive workflows. Users need query optimization, caching, or pre-computed indices for large datasets.",
        "severity": "High",
        "time": "Q4 2025",
        "graph_data": '{"labels":["<100 rows","100-250","250-500","500-1000","1000+"],"values":[1.2,2.8,4.5,8.3,14.7],"metric":"avg response time (seconds)"}',
        "persona_index": 4,
        "quote_indices": [24],
    },
    {
        "title": "No version history or rollback for agent configurations",
        "type": "Workflow Gap",
        "details": "Agent system prompts, knowledge base connections, and behavioral settings have no version history. Teams report losing working configurations when someone makes an edit. Need configuration versioning with diff view and one-click rollback.",
        "severity": "High",
        "time": "Q4 2025",
        "graph_data": '{"labels":["Jul","Aug","Sep","Oct","Nov","Dec"],"values":[2,4,7,11,15,22],"metric":"config rollback requests (support tickets)"}',
        "persona_index": 3,
        "quote_indices": [16],
    },

    # -- Medium --
    {
        "title": "Brand voice customization for agent outputs",
        "type": "Feature Request",
        "details": "Agents produce generic-sounding outputs that don't match organizational brand voice. Marketing and communications teams need the ability to train agents on tone guidelines, approved terminology, and style examples. Current workaround of stuffing brand guidelines into system prompts is fragile and limited by context window.",
        "severity": "Medium",
        "time": "Q1 2026",
        "graph_data": '{"labels":["On-brand","Acceptable","Off-brand","Unusable"],"values":[8,31,42,19],"metric":"agent output brand compliance %"}',
        "persona_index": 2,
        "quote_indices": [11],
    },
    {
        "title": "Per-seat pricing model discourages team-wide adoption",
        "type": "Unmet Need",
        "details": "Current per-seat pricing charges all workspace members equally, even though only a subset (power users, ops leads) actively build or configure agents. Small teams and startups report that the cost is hard to justify when most seats are passive consumers. Consider tiered pricing with builder vs. consumer seats.",
        "severity": "Medium",
        "time": "Q4 2025",
        "graph_data": '{"labels":["Builders","Power users","Occasional users","Passive consumers"],"values":[8,15,27,50],"metric":"user type distribution %"}',
        "persona_index": 1,
        "quote_indices": [9, 40],
    },
    {
        "title": "Unstructured free-text content degrades agent output quality",
        "type": "Pain Point",
        "details": "Agent performance drops significantly when knowledge bases contain unstructured free-text pages versus structured database entries. Design rationale docs, meeting notes, and long-form wiki pages produce unreliable outputs. Users need guidance on content structure or improved handling of unstructured content.",
        "severity": "Medium",
        "time": "Q3 2025",
        "graph_data": '{"labels":["Structured DB","Semi-structured","Wiki pages","Meeting notes","Free-text"],"values":[92,74,51,38,23],"metric":"answer accuracy % by content type"}',
        "persona_index": 5,
        "quote_indices": [26],
    },
    {
        "title": "Agent template marketplace for common use cases",
        "type": "Feature Request",
        "details": "Users repeatedly build the same types of agents (standup summarizer, FAQ bot, report generator). A curated template marketplace would reduce time-to-value and showcase best practices. Templates should include system prompt, recommended database schema, and example outputs.",
        "severity": "Medium",
        "time": "Q1 2026",
        "graph_data": '{"labels":["FAQ bot","Standup summarizer","Report generator","Onboarding guide","Audit agent"],"values":[34,28,21,11,6],"metric":"most-duplicated agent types %"}',
        "persona_index": 5,
        "quote_indices": [29],
    },
    {
        "title": "Agent analytics and usage monitoring dashboard",
        "type": "Feature Request",
        "details": "No visibility into how agents are being used: query volume, response accuracy, user satisfaction, most common questions. Agent builders and workspace admins need analytics to measure ROI, identify improvement areas, and justify continued investment.",
        "severity": "Medium",
        "time": "Q1 2026",
        "graph_data": '{"labels":["Query volume","Accuracy rate","User satisfaction","Top questions","Error rate"],"values":[91,87,76,68,62],"metric":"requested analytics features (% of admins)"}',
        "persona_index": 7,
        "quote_indices": [39],
    },

    # -- Low --
    {
        "title": "Custom agent avatars and branding",
        "type": "Feature Request",
        "details": "Agent interfaces use a generic icon. Teams want custom avatars, names, and color themes to make agents feel like branded internal tools. Low priority but high polish factor for enterprise deployments.",
        "severity": "Low",
        "time": "Q1 2026",
        "graph_data": "",
        "persona_index": None,
        "quote_indices": [],
    },
    {
        "title": "Agent output formatting options (markdown, tables, code blocks)",
        "type": "Feature Request",
        "details": "Agent outputs default to flat paragraphs. Users working with technical specs, data analysis, or structured reports need markdown formatting, tables, and code blocks in responses. Output formatting control would significantly improve readability for technical use cases.",
        "severity": "Low",
        "time": "Q1 2026",
        "graph_data": '{"labels":["Plain text","Markdown","Tables","Code blocks"],"values":[100,0,0,0],"metric":"current vs requested output formats"}',
        "persona_index": 5,
        "quote_indices": [27],
    },
    {
        "title": "Mobile experience for agent interactions",
        "type": "Unmet Need",
        "details": "Agents are only usable in the desktop and web Notion apps. Mobile workers (field sales, traveling executives, remote HR) need to query agents from the Notion mobile app. Currently no mobile-optimized agent interface exists.",
        "severity": "Low",
        "time": "Q2 2026",
        "graph_data": '{"labels":["Desktop","Web","Mobile (requested)"],"values":[61,34,5],"metric":"agent usage by platform %"}',
        "persona_index": None,
        "quote_indices": [],
    },
]


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

async def main() -> None:
    print("=== Seeding Notion databases ===\n")

    # 1. Competitors (no dependencies)
    print(f"Creating {len(COMPETITORS)} competitors...")
    competitor_ids: dict[str, str] = {}
    for comp in COMPETITORS:
        cid = await create_competitor(comp)
        competitor_ids[comp.competitor_name] = cid
        print(f"  + {comp.competitor_name} -> {cid}")

    # 2. Personas
    print(f"\nCreating {len(PERSONAS)} personas...")
    persona_ids: list[str] = []
    for persona in PERSONAS:
        pid = await create_persona(persona)
        persona_ids.append(pid)
        print(f"  + {persona.persona_type} -> {pid}")

    # 3. Quotes (reference persona IDs + competitor IDs)
    print(f"\nCreating {len(QUOTES)} quotes...")
    quote_ids: list[str] = []
    for i, q in enumerate(QUOTES):
        persona_id = persona_ids[q["persona_index"]] if q["persona_index"] is not None else None
        comp_id = competitor_ids.get(q["competitor_name"]) if q.get("competitor_name") else None
        qc = QuoteCreate(
            quote_text=q["text"],
            speaker=q["speaker"],
            sentiment=q["sentiment"],
            quote_type=q["quote_type"],
            related_persona_id=persona_id,
            competitor_mentioned_id=comp_id,
        )
        qid = await create_quote(qc)
        quote_ids.append(qid)
        print(f"  + Quote {i} ({q['quote_type']}, {q['sentiment']}) -> {qid}")

    # 4. Issues (reference persona IDs + quote IDs)
    print(f"\nCreating {len(ISSUES)} issues...")
    for i, issue in enumerate(ISSUES):
        persona_id = persona_ids[issue["persona_index"]] if issue["persona_index"] is not None else None
        related_quote_ids = [quote_ids[idx] for idx in issue.get("quote_indices", [])]
        ic = IssueCreate(
            issue_title=issue["title"],
            issue_type=issue["type"],
            issue_details=issue["details"],
            severity=issue["severity"],
            time=issue.get("time", ""),
            graph_data=issue.get("graph_data", ""),
            related_persona_id=persona_id,
            related_quote_ids=related_quote_ids,
        )
        iid = await create_issue(ic)
        print(f"  + Issue {i}: {issue['title'][:60]}... -> {iid}")

    # Summary
    print("\n=== Seeding complete ===")
    print(f"  Competitors: {len(competitor_ids)}")
    print(f"  Personas:    {len(persona_ids)}")
    print(f"  Quotes:      {len(quote_ids)}")
    print(f"  Issues:      {len(ISSUES)}")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nSeeding interrupted.")
        sys.exit(1)
