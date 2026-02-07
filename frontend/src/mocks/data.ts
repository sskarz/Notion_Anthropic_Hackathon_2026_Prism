import type { ResearchProject } from '../types/project.ts';
import type { InterviewTranscript } from '../types/transcript.ts';
import type { QuoteEvidence } from '../types/quote.ts';
import type { MarketIntelligence } from '../types/market.ts';
import type { CompetitorEntry } from '../types/competitor.ts';
import type { InsightTheme } from '../types/insight.ts';
import type { ActionItem } from '../types/action.ts';

// --- Research Project ---

export const mockProject: ResearchProject = {
  id: 'proj-onboarding-001',
  name: 'Onboarding Experience for Mid-Market SaaS',
  description:
    'Exploring how mid-market SaaS teams onboard new users, identifying friction points, and evaluating competitive approaches to first-time user experience.',
  status: 'Researching',
  interview_style: 'Exploratory',
  total_interviews_planned: 6,
  total_interviews_completed: 4,
  key_questions: [
    'What does the first 30 minutes look like for a new user?',
    'Where do mid-market teams lose users during onboarding?',
    'How do teams measure onboarding success today?',
    'What role does human touch play vs. self-serve onboarding?',
  ],
  created_at: '2026-01-15T09:00:00Z',
  updated_at: '2026-02-06T14:32:00Z',
};

// --- Interview Transcripts ---

export const mockTranscripts: InterviewTranscript[] = [
  {
    id: 'tx-001',
    project_id: 'proj-onboarding-001',
    participant: {
      name: 'Sarah Chen',
      role: 'CS Lead',
      company: 'FinEdge',
      industry: 'Fintech',
    },
    duration_minutes: 28,
    coverage_score: 0.85,
    key_topics: [
      'white-glove onboarding',
      'time-to-value metrics',
      'role-based setup',
      'CS team bandwidth',
    ],
    summary:
      'Sarah described how FinEdge moved from a one-size-fits-all onboarding doc to role-based guided paths. Their CS team saw a 40% reduction in support tickets after introducing progressive disclosure during setup. She emphasized that mid-market customers expect personalization but cannot afford dedicated onboarding managers.',
    conducted_at: '2026-01-22T10:00:00Z',
    created_at: '2026-01-22T11:15:00Z',
  },
  {
    id: 'tx-002',
    project_id: 'proj-onboarding-001',
    participant: {
      name: 'Marcus Johnson',
      role: 'Product Manager',
      company: 'CareStack',
      industry: 'Healthcare SaaS',
    },
    duration_minutes: 32,
    coverage_score: 0.9,
    key_topics: [
      'compliance requirements',
      'admin vs end-user onboarding',
      'integration complexity',
      'onboarding checklists',
    ],
    summary:
      'Marcus detailed how healthcare SaaS onboarding is uniquely constrained by compliance and security reviews. CareStack splits onboarding into admin setup (integrations, permissions) and end-user activation. Their biggest insight was that checklists outperform video tutorials for technical buyers by 3:1 in completion rates.',
    conducted_at: '2026-01-29T14:00:00Z',
    created_at: '2026-01-29T15:30:00Z',
  },
  {
    id: 'tx-003',
    project_id: 'proj-onboarding-001',
    participant: {
      name: 'Priya Patel',
      role: 'Engineering Director',
      company: 'ShipFast',
      industry: 'Logistics',
    },
    duration_minutes: 18,
    coverage_score: 0.62,
    key_topics: [
      'API-first onboarding',
      'developer experience',
      'sandbox environments',
      'documentation quality',
    ],
    summary:
      'Priya focused on the developer side of onboarding. ShipFast provides sandbox environments with pre-loaded data, which she said is the single most impactful onboarding investment they have made. She was critical of tools that force UI walkthroughs before exposing APIs.',
    conducted_at: '2026-02-03T11:00:00Z',
    created_at: '2026-02-03T11:45:00Z',
  },
  {
    id: 'tx-004',
    project_id: 'proj-onboarding-001',
    participant: {
      name: 'David Kim',
      role: 'VP Operations',
      company: 'PeopleOps Pro',
      industry: 'HR Tech',
    },
    duration_minutes: 25,
    coverage_score: 0.78,
    key_topics: [
      'change management',
      'executive buy-in',
      'training programs',
      'adoption metrics',
    ],
    summary:
      'David highlighted that onboarding failure in HR tech is usually an organizational problem, not a product problem. PeopleOps Pro now bundles change management playbooks with their onboarding flow. He noted that time-to-first-value under 48 hours correlates strongly with 6-month retention.',
    conducted_at: '2026-02-05T16:00:00Z',
    created_at: '2026-02-05T17:00:00Z',
  },
];

// --- Quote Evidence ---

export const mockQuotes: QuoteEvidence[] = [
  {
    id: 'q-001',
    project_id: 'proj-onboarding-001',
    text: 'We stopped sending 30-page PDFs and started showing people three things they could do in their first ten minutes. Support tickets dropped 40% in a quarter.',
    source_type: 'Interview',
    source_id: 'tx-001',
    speaker_name: 'Sarah Chen',
    speaker_role: 'CS Lead, FinEdge',
    sentiment: 'positive',
    theme_ids: ['ins-001', 'ins-003'],
    created_at: '2026-01-22T11:15:00Z',
  },
  {
    id: 'q-002',
    project_id: 'proj-onboarding-001',
    text: 'Mid-market teams want the white-glove feel without the white-glove cost. They need smart defaults and progressive disclosure, not a dedicated CSM for every account.',
    source_type: 'Interview',
    source_id: 'tx-001',
    speaker_name: 'Sarah Chen',
    speaker_role: 'CS Lead, FinEdge',
    sentiment: 'neutral',
    theme_ids: ['ins-001', 'ins-002'],
    created_at: '2026-01-22T11:16:00Z',
  },
  {
    id: 'q-003',
    project_id: 'proj-onboarding-001',
    text: 'Checklists beat video tutorials 3:1 for completion rates with our technical buyers. People want to do, not watch.',
    source_type: 'Interview',
    source_id: 'tx-002',
    speaker_name: 'Marcus Johnson',
    speaker_role: 'PM, CareStack',
    sentiment: 'positive',
    theme_ids: ['ins-003'],
    created_at: '2026-01-29T15:30:00Z',
  },
  {
    id: 'q-004',
    project_id: 'proj-onboarding-001',
    text: 'We split onboarding into admin setup and end-user activation. Trying to do both at once was confusing everyone.',
    source_type: 'Interview',
    source_id: 'tx-002',
    speaker_name: 'Marcus Johnson',
    speaker_role: 'PM, CareStack',
    sentiment: 'positive',
    theme_ids: ['ins-001', 'ins-004'],
    created_at: '2026-01-29T15:31:00Z',
  },
  {
    id: 'q-005',
    project_id: 'proj-onboarding-001',
    text: 'If your onboarding forces me through a UI walkthrough before I can see the API, I am already looking for alternatives.',
    source_type: 'Interview',
    source_id: 'tx-003',
    speaker_name: 'Priya Patel',
    speaker_role: 'Engineering Director, ShipFast',
    sentiment: 'negative',
    theme_ids: ['ins-002', 'ins-005'],
    created_at: '2026-02-03T11:45:00Z',
  },
  {
    id: 'q-006',
    project_id: 'proj-onboarding-001',
    text: 'A sandbox with pre-loaded data is the single most impactful onboarding investment we have made. Developers want to experiment, not read.',
    source_type: 'Interview',
    source_id: 'tx-003',
    speaker_name: 'Priya Patel',
    speaker_role: 'Engineering Director, ShipFast',
    sentiment: 'positive',
    theme_ids: ['ins-003', 'ins-005'],
    created_at: '2026-02-03T11:46:00Z',
  },
  {
    id: 'q-007',
    project_id: 'proj-onboarding-001',
    text: 'Onboarding failure is almost never a product problem. It is an organizational change management problem. If the VP does not champion it, nobody finishes setup.',
    source_type: 'Interview',
    source_id: 'tx-004',
    speaker_name: 'David Kim',
    speaker_role: 'VP Operations, PeopleOps Pro',
    sentiment: 'neutral',
    theme_ids: ['ins-004', 'ins-006'],
    created_at: '2026-02-05T17:00:00Z',
  },
  {
    id: 'q-008',
    project_id: 'proj-onboarding-001',
    text: 'When time-to-first-value is under 48 hours, our 6-month retention jumps from 62% to 89%. That number changed everything about how we prioritize.',
    source_type: 'Interview',
    source_id: 'tx-004',
    speaker_name: 'David Kim',
    speaker_role: 'VP Operations, PeopleOps Pro',
    sentiment: 'positive',
    theme_ids: ['ins-003'],
    created_at: '2026-02-05T17:01:00Z',
  },
  {
    id: 'q-009',
    project_id: 'proj-onboarding-001',
    text: 'Dovetail is great for tagging and organizing, but the onboarding itself took our team two weeks to figure out. Ironic for a research tool.',
    source_type: 'G2 Review',
    source_id: 'g2-review-4821',
    speaker_name: 'Anonymous Reviewer',
    speaker_role: 'UX Researcher, Mid-Market',
    sentiment: 'mixed',
    theme_ids: ['ins-001', 'ins-005'],
    created_at: '2026-01-18T00:00:00Z',
  },
  {
    id: 'q-010',
    project_id: 'proj-onboarding-001',
    text: 'Productboard has the best onboarding I have experienced in product tools. The guided setup wizard adapts based on your role and team size.',
    source_type: 'Capterra Review',
    source_id: 'capterra-review-7733',
    speaker_name: 'Anonymous Reviewer',
    speaker_role: 'Product Manager',
    sentiment: 'positive',
    theme_ids: ['ins-001', 'ins-003'],
    created_at: '2026-01-25T00:00:00Z',
  },
  {
    id: 'q-011',
    project_id: 'proj-onboarding-001',
    text: 'Tried three different research tools last quarter. The one that let me run my first test in under 10 minutes won. Everything else is noise.',
    source_type: 'Reddit',
    source_id: 'reddit-uxresearch-abc123',
    speaker_name: 'u/pmresearcher_daily',
    speaker_role: 'Product Researcher',
    sentiment: 'neutral',
    theme_ids: ['ins-003'],
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'q-012',
    project_id: 'proj-onboarding-001',
    text: 'The problem with most SaaS onboarding is they treat a 5-person team the same as a 500-person org. Context matters enormously.',
    source_type: 'Reddit',
    source_id: 'reddit-saas-def456',
    speaker_name: 'u/enterprise_pm',
    speaker_role: 'Director of Product',
    sentiment: 'negative',
    theme_ids: ['ins-001', 'ins-002'],
    created_at: '2026-02-02T00:00:00Z',
  },
  {
    id: 'q-013',
    project_id: 'proj-onboarding-001',
    text: 'Just launched on PH and the #1 feedback is people love our interactive onboarding. We let users pick a template and immediately see their data in context.',
    source_type: 'Product Hunt',
    source_id: 'ph-launch-789',
    speaker_name: 'Founder',
    speaker_role: 'CEO, ResearchKit',
    sentiment: 'positive',
    theme_ids: ['ins-003', 'ins-005'],
    created_at: '2026-02-04T00:00:00Z',
  },
];

// --- Market Intelligence ---

export const mockMarketIntel: MarketIntelligence[] = [
  {
    id: 'mi-001',
    project_id: 'proj-onboarding-001',
    title: 'The State of SaaS Onboarding in 2026',
    source_type: 'Article',
    source_name: 'TechCrunch',
    source_url: 'https://techcrunch.com/2026/01/state-of-saas-onboarding',
    summary:
      'Comprehensive overview showing 68% of mid-market SaaS companies now invest in role-based onboarding, up from 34% in 2024. Interactive walkthroughs have replaced video tutorials as the dominant approach.',
    relevance_score: 0.95,
    published_at: '2026-01-10T08:00:00Z',
    created_at: '2026-01-12T09:00:00Z',
  },
  {
    id: 'mi-002',
    project_id: 'proj-onboarding-001',
    title: 'Why Time-to-Value Is the Only Onboarding Metric That Matters',
    source_type: 'Article',
    source_name: "Lenny's Newsletter",
    source_url: 'https://lennysnewsletter.com/p/time-to-value-onboarding',
    summary:
      'Deep dive into TTV metrics across 200 B2B SaaS companies. Companies with TTV under 1 hour see 2.3x better retention than those with TTV over 1 week. Argues for value-first onboarding over feature tours.',
    relevance_score: 0.92,
    published_at: '2026-01-20T12:00:00Z',
    created_at: '2026-01-21T10:00:00Z',
  },
  {
    id: 'mi-003',
    project_id: 'proj-onboarding-001',
    title: 'Onboarding as a Growth Lever: Lessons from Figma, Notion, and Linear',
    source_type: 'Article',
    source_name: 'First Round Review',
    source_url: 'https://review.firstround.com/onboarding-growth-lever',
    summary:
      'Case studies from three product-led growth companies. Common thread: onboarding should demonstrate the "aha moment" within the first session. Notion credits their template gallery with 60% of new user activation.',
    relevance_score: 0.88,
    published_at: '2026-01-05T10:00:00Z',
    created_at: '2026-01-06T14:00:00Z',
  },
  {
    id: 'mi-004',
    project_id: 'proj-onboarding-001',
    title: 'Research Tools Market Report Q1 2026',
    source_type: 'Report',
    source_name: 'Gartner',
    source_url: 'https://gartner.com/reports/research-tools-q1-2026',
    summary:
      'Market for UX research tools projected to reach $4.2B by 2028. AI-powered analysis features are now table stakes. Consolidation trend: teams want fewer tools that do more rather than best-of-breed point solutions.',
    relevance_score: 0.82,
    published_at: '2026-01-28T00:00:00Z',
    created_at: '2026-01-30T09:00:00Z',
  },
  {
    id: 'mi-005',
    project_id: 'proj-onboarding-001',
    title: 'r/SaaS: What is the best onboarding you have experienced as a buyer?',
    source_type: 'Discussion',
    source_name: 'Reddit r/SaaS',
    source_url: 'https://reddit.com/r/SaaS/comments/best-onboarding-buyer',
    summary:
      '342 comments. Top mentions: Linear (clean, minimal), Notion (template-first), Figma (collaborative from day one). Common complaints: forced demo calls, gated features, generic email sequences.',
    relevance_score: 0.75,
    published_at: '2026-02-01T00:00:00Z',
    created_at: '2026-02-02T08:00:00Z',
  },
  {
    id: 'mi-006',
    project_id: 'proj-onboarding-001',
    title: 'Dovetail 4.0 Launch: AI-Powered Research Assistant',
    source_type: 'Launch',
    source_name: 'Product Hunt',
    source_url: 'https://producthunt.com/posts/dovetail-4-0',
    summary:
      'Dovetail launched v4.0 with AI tagging and theme generation. #2 Product of the Day. Comments highlight improved onboarding but note steep learning curve for advanced features. Priced at $29/user/month for teams.',
    relevance_score: 0.85,
    published_at: '2026-01-15T07:00:00Z',
    created_at: '2026-01-15T12:00:00Z',
  },
  {
    id: 'mi-007',
    project_id: 'proj-onboarding-001',
    title: 'G2 Grid for Product Management Software - Winter 2026',
    source_type: 'Review',
    source_name: 'G2',
    source_url: 'https://g2.com/categories/product-management/grid',
    summary:
      'Productboard leads in user satisfaction. Dovetail and UserTesting ranked highest for research capabilities. Common praise: integrations. Common complaint: onboarding complexity for non-technical users.',
    relevance_score: 0.78,
    published_at: '2026-01-08T00:00:00Z',
    created_at: '2026-01-10T11:00:00Z',
  },
];

// --- Competitors ---

export const mockCompetitors: CompetitorEntry[] = [
  {
    id: 'comp-001',
    project_id: 'proj-onboarding-001',
    name: 'Dovetail',
    website: 'https://dovetail.com',
    description:
      'Research analysis platform that helps teams collect, organize, and analyze qualitative user research data at scale.',
    key_features: [
      'AI-powered tagging and theme generation',
      'Video and audio transcript analysis',
      'Highlight reels for stakeholder sharing',
      'Repository for cross-project insights',
      'Integrations with Slack, Jira, Confluence',
    ],
    pricing_tiers: [
      {
        name: 'Free',
        price: '$0/month',
        features: ['3 projects', '1 user', 'Basic tagging'],
      },
      {
        name: 'Team',
        price: '$29/user/month',
        features: ['Unlimited projects', 'AI tagging', 'Video analysis', 'Integrations'],
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        features: ['SSO', 'Audit logs', 'Dedicated support', 'Custom integrations'],
      },
    ],
    user_sentiment: 'positive',
    strengths: [
      'Best-in-class qualitative analysis',
      'Strong AI tagging in v4.0',
      'Excellent highlight reel feature',
    ],
    weaknesses: [
      'Steep learning curve for new teams',
      'Onboarding takes 1-2 weeks',
      'No built-in quantitative analysis',
    ],
    updated_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'comp-002',
    project_id: 'proj-onboarding-001',
    name: 'Productboard',
    website: 'https://productboard.com',
    description:
      'Product management platform that helps teams understand user needs, prioritize features, and align everyone around a roadmap.',
    key_features: [
      'Feature prioritization with scoring',
      'Customer feedback portal',
      'Roadmap views (timeline, kanban, table)',
      'Insights board linking feedback to features',
      'Integrations with Intercom, Zendesk, Salesforce',
    ],
    pricing_tiers: [
      {
        name: 'Essentials',
        price: '$19/user/month',
        features: ['Feedback inbox', 'Feature board', 'Basic roadmap'],
      },
      {
        name: 'Pro',
        price: '$59/user/month',
        features: ['Advanced prioritization', 'Customer portal', 'Integrations'],
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        features: ['SSO', 'API access', 'Advanced permissions', 'Dedicated CSM'],
      },
    ],
    user_sentiment: 'positive',
    strengths: [
      'Best onboarding experience in category',
      'Role-based guided setup wizard',
      'Strong feedback-to-roadmap pipeline',
    ],
    weaknesses: [
      'Not built for deep research analysis',
      'Expensive for larger teams',
      'Limited qualitative analysis features',
    ],
    updated_at: '2026-01-28T00:00:00Z',
  },
  {
    id: 'comp-003',
    project_id: 'proj-onboarding-001',
    name: 'UserTesting',
    website: 'https://usertesting.com',
    description:
      'Human insight platform that enables organizations to get feedback from real users through moderated and unmoderated tests.',
    key_features: [
      'Participant recruitment panel',
      'Moderated and unmoderated test sessions',
      'AI-powered sentiment analysis',
      'Click and heatmap analytics',
      'Highlight reels and clip sharing',
    ],
    pricing_tiers: [
      {
        name: 'Essentials',
        price: '$49/session',
        features: ['Unmoderated tests', 'Basic analysis', '15 min sessions'],
      },
      {
        name: 'Advanced',
        price: '$99/session',
        features: ['Moderated tests', 'AI analysis', 'Longer sessions', 'Screener questions'],
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        features: ['Unlimited sessions', 'Panel management', 'SSO', 'API access'],
      },
    ],
    user_sentiment: 'mixed',
    strengths: [
      'Largest participant panel',
      'Fast turnaround on unmoderated tests',
      'Good video annotation tools',
    ],
    weaknesses: [
      'Per-session pricing adds up quickly',
      'Panel quality varies',
      'Onboarding optimized for enterprise, confusing for small teams',
    ],
    updated_at: '2026-01-20T00:00:00Z',
  },
  {
    id: 'comp-004',
    project_id: 'proj-onboarding-001',
    name: 'ChatPRD',
    website: 'https://chatprd.ai',
    description:
      'AI-powered product requirements assistant that helps PMs write PRDs, user stories, and research plans through conversational AI.',
    key_features: [
      'Conversational PRD generation',
      'User story writing with acceptance criteria',
      'Research plan templates',
      'Competitive analysis generation',
      'Integration with Notion, Linear, Jira',
    ],
    pricing_tiers: [
      {
        name: 'Free',
        price: '$0/month',
        features: ['5 PRDs/month', 'Basic templates'],
      },
      {
        name: 'Pro',
        price: '$25/month',
        features: ['Unlimited PRDs', 'Custom templates', 'Integrations', 'Team sharing'],
      },
      {
        name: 'Team',
        price: '$20/user/month',
        features: ['Everything in Pro', 'Shared workspace', 'Admin controls', 'Priority support'],
      },
    ],
    user_sentiment: 'positive',
    strengths: [
      'Fastest time-to-value in category',
      'Intuitive conversational interface',
      'Great for solo PMs and small teams',
    ],
    weaknesses: [
      'No qualitative research analysis',
      'AI outputs need significant editing',
      'Limited collaboration features',
    ],
    updated_at: '2026-02-03T00:00:00Z',
  },
];

// --- Insight Themes ---

export const mockInsights: InsightTheme[] = [
  {
    id: 'ins-001',
    project_id: 'proj-onboarding-001',
    title: 'Mid-market teams need progressive onboarding, not documentation dumps',
    description:
      'Across interviews and reviews, mid-market teams consistently reject comprehensive documentation in favor of progressive disclosure that reveals features as users need them. One-size-fits-all approaches fail because team sizes, roles, and use cases vary enormously.',
    category: 'Pain Point',
    confidence_score: 0.92,
    supporting_quote_ids: ['q-001', 'q-002', 'q-004', 'q-009', 'q-010', 'q-012'],
    created_at: '2026-02-06T10:00:00Z',
    updated_at: '2026-02-06T14:00:00Z',
  },
  {
    id: 'ins-002',
    project_id: 'proj-onboarding-001',
    title: 'Context-aware onboarding (role, team size, use case) is a key differentiator',
    description:
      'Products that adapt their onboarding based on user role, team size, and stated use case see significantly higher completion rates. Productboard is the benchmark here with their setup wizard. Generic flows frustrate power users and overwhelm beginners equally.',
    category: 'Opportunity',
    confidence_score: 0.85,
    supporting_quote_ids: ['q-002', 'q-005', 'q-012'],
    created_at: '2026-02-06T10:05:00Z',
    updated_at: '2026-02-06T14:00:00Z',
  },
  {
    id: 'ins-003',
    project_id: 'proj-onboarding-001',
    title: 'Time-to-first-value under 10 minutes is the activation threshold',
    description:
      'Multiple sources confirm that users who achieve a meaningful outcome within 10 minutes are dramatically more likely to convert and retain. This applies whether the first value is running a test, seeing an insight, or generating a deliverable.',
    category: 'Validation',
    confidence_score: 0.88,
    supporting_quote_ids: ['q-001', 'q-003', 'q-006', 'q-008', 'q-010', 'q-011', 'q-013'],
    created_at: '2026-02-06T10:10:00Z',
    updated_at: '2026-02-06T14:00:00Z',
  },
  {
    id: 'ins-004',
    project_id: 'proj-onboarding-001',
    title: 'Onboarding must address both admin setup and end-user activation separately',
    description:
      'In mid-market orgs, the person who buys and configures the tool is not the daily user. Conflating admin setup (integrations, permissions, billing) with end-user activation (first workflow, first deliverable) causes confusion and delays for both personas.',
    category: 'Need',
    confidence_score: 0.76,
    supporting_quote_ids: ['q-004', 'q-007'],
    created_at: '2026-02-06T10:15:00Z',
    updated_at: '2026-02-06T14:00:00Z',
  },
  {
    id: 'ins-005',
    project_id: 'proj-onboarding-001',
    title: 'Developer-persona users reject guided UI tours in favor of sandbox environments',
    description:
      'Technical users (developers, engineering leaders) have a strong negative reaction to forced UI walkthroughs. They prefer sandbox environments with realistic data where they can explore APIs and features at their own pace. Pre-loaded data in sandboxes is critical.',
    category: 'Pain Point',
    confidence_score: 0.72,
    supporting_quote_ids: ['q-005', 'q-006', 'q-009', 'q-013'],
    created_at: '2026-02-06T10:20:00Z',
    updated_at: '2026-02-06T14:00:00Z',
  },
  {
    id: 'ins-006',
    project_id: 'proj-onboarding-001',
    title: 'Executive sponsorship is a prerequisite for successful org-wide onboarding',
    description:
      'For tools requiring team-wide adoption, onboarding fails without executive buy-in. The product should facilitate or prompt executive engagement (e.g., invite flows, champion dashboards, progress visibility) rather than treating it as an external concern.',
    category: 'Risk',
    confidence_score: 0.48,
    supporting_quote_ids: ['q-007'],
    created_at: '2026-02-06T10:25:00Z',
    updated_at: '2026-02-06T14:00:00Z',
  },
];

// --- Action Items ---

export const mockActions: ActionItem[] = [
  {
    id: 'act-001',
    project_id: 'proj-onboarding-001',
    title: 'Build role-based onboarding paths',
    description:
      'Design and implement onboarding flows that adapt based on user role (PM, researcher, engineer, exec). Each path should highlight the 3 most relevant features for that role and lead to a role-appropriate first-value moment within 10 minutes.',
    priority: 'P0',
    type: 'Feature',
    status: 'Proposed',
    supporting_insight_ids: ['ins-001', 'ins-002', 'ins-003'],
    created_at: '2026-02-06T14:00:00Z',
    updated_at: '2026-02-06T14:00:00Z',
  },
  {
    id: 'act-002',
    project_id: 'proj-onboarding-001',
    title: 'Create interactive sandbox with pre-loaded demo data',
    description:
      'Build a sandbox environment pre-populated with realistic research data (interviews, quotes, insights) so new users can explore features immediately without entering their own data. Critical for developer personas and evaluators.',
    priority: 'P0',
    type: 'Feature',
    status: 'Proposed',
    supporting_insight_ids: ['ins-003', 'ins-005'],
    created_at: '2026-02-06T14:05:00Z',
    updated_at: '2026-02-06T14:05:00Z',
  },
  {
    id: 'act-003',
    project_id: 'proj-onboarding-001',
    title: 'Separate admin setup from end-user activation flows',
    description:
      'Split the onboarding experience into two distinct tracks: admin setup (integrations, team invites, permissions) and end-user activation (first project, first insight). Allow admins to complete setup asynchronously while end-users can start immediately.',
    priority: 'P1',
    type: 'Improvement',
    status: 'Proposed',
    supporting_insight_ids: ['ins-004'],
    created_at: '2026-02-06T14:10:00Z',
    updated_at: '2026-02-06T14:10:00Z',
  },
  {
    id: 'act-004',
    project_id: 'proj-onboarding-001',
    title: 'Investigate executive champion features for team adoption',
    description:
      'Research and prototype features that help executive sponsors drive team-wide adoption: champion dashboards showing team progress, automated nudges for inactive users, ROI reporting for decision-makers. Low confidence insight needs more validation.',
    priority: 'P2',
    type: 'Investigation',
    status: 'Proposed',
    supporting_insight_ids: ['ins-006'],
    created_at: '2026-02-06T14:15:00Z',
    updated_at: '2026-02-06T14:15:00Z',
  },
];
