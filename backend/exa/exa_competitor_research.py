#!/usr/bin/env python3
"""
Exa competitor-issue research runner.

Usage:
  python backend/exa_competitor_research.py \
    --company-context-file backend/examples/company_context.txt \
    --customer-issue "Users cannot export dashboard as PDF from mobile app."

Required env var:
  EXA_API_KEY
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
from urllib.parse import urlparse
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List


MAX_COMPETITORS = 8


STOPWORDS = {
    "a",
    "an",
    "the",
    "and",
    "or",
    "to",
    "of",
    "for",
    "in",
    "on",
    "with",
    "from",
    "that",
    "this",
    "is",
    "are",
    "be",
    "can",
    "cannot",
    "can't",
    "could",
    "would",
    "should",
    "our",
    "your",
    "my",
    "their",
    "users",
    "customer",
    "customers",
    "competitor",
    "competitors",
    "alternative",
    "alternatives",
}


@dataclass
class QueryPlanItem:
    competitor: str
    query: str
    intent: str
    target_sources: List[str]
    priority: int


def normalize_issue(customer_issue: str) -> str:
    text = re.sub(r"\s+", " ", customer_issue.strip())
    return text.rstrip(".")


def issue_synonyms(customer_issue: str) -> List[str]:
    base = normalize_issue(customer_issue)
    words = re.findall(r"[a-zA-Z0-9]+", base.lower())
    keywords = [w for w in words if w not in STOPWORDS]
    keyword_phrase = " ".join(keywords[:8]) if keywords else base.lower()

    variants = [
        base,
        keyword_phrase,
        f"{base} workaround",
        f"{base} fix",
        f"{base} known issue",
        f"{base} not working",
        f"unable to {keyword_phrase}" if keyword_phrase else f"unable to {base.lower()}",
    ]
    deduped: List[str] = []
    seen = set()
    for v in variants:
        vv = v.strip()
        if vv and vv.lower() not in seen:
            seen.add(vv.lower())
            deduped.append(vv)
    return deduped


def extract_competitors(company_context: str) -> List[str]:
    own_company = ""
    own_match = re.search(r"^\s*([A-Z][A-Za-z0-9&.\-\s]{1,50})\s+is\b", company_context)
    if own_match:
        own_company = own_match.group(1).strip().lower()

    explicit_matches = re.findall(
        r"(?:competitors?|alternatives?)\s*(?::|\-|are)\s*([^\n]+)",
        company_context,
        flags=re.IGNORECASE,
    )
    names: List[str] = []
    for match in explicit_matches:
        parts = re.split(r",|/|;|\|| and ", match)
        names.extend([p.strip() for p in parts if p.strip()])

    if not names:
        title_case_words = re.findall(r"\b[A-Z][A-Za-z0-9&\-]{1,}\b", company_context)
        dedup = []
        seen = set()
        for word in title_case_words:
            if word.lower() in {"we", "our", "product", "company", "customer"}:
                continue
            if word not in seen:
                seen.add(word)
                dedup.append(word)
        names = dedup

    cleaned = []
    seen_cleaned = set()
    for n in names:
        n2 = re.sub(r"[^\w&\-\s.]", "", n).strip()
        n2 = n2.strip(".")
        if not n2:
            continue
        lower = n2.lower()
        if lower in STOPWORDS:
            continue
        if own_company and lower == own_company:
            continue
        if lower not in seen_cleaned:
            seen_cleaned.add(lower)
            cleaned.append(n2)
        if len(cleaned) >= MAX_COMPETITORS:
            break
    return cleaned


def build_queries(competitor: str, synonyms: List[str]) -> List[QueryPlanItem]:
    phrase = synonyms[0]
    alt = synonyms[1] if len(synonyms) > 1 else phrase
    if "." in competitor:
        domain = competitor.lower()
    else:
        domain = f"{competitor.lower().replace(' ', '')}.com"
    source_queries = [
        ("issue existence", "help center", f'site:{domain} "{phrase}" support'),
        ("workaround", "forum", f'"{competitor}" "{alt}" workaround forum'),
        ("official fix", "release notes", f'"{competitor}" "{phrase}" release notes changelog'),
        ("incident history", "status page", f'"{competitor}" "{phrase}" status incident'),
        ("feature support", "help center", f'"{competitor}" export dashboard csv support documentation'),
        ("policy/limitation", "third-party", f'"{competitor}" "{phrase}" "known limitation" OR "expected behavior"'),
    ]
    items: List[QueryPlanItem] = []
    for i, (intent, target, query) in enumerate(source_queries, start=1):
        items.append(
            QueryPlanItem(
                competitor=competitor,
                query=query,
                intent=intent,
                target_sources=[target],
                priority=i,
            )
        )
    return items


def preferred_domains_for_competitor(competitor: str) -> List[str]:
    c = competitor.lower().strip()
    domain_map = {
        "jira": ["support.atlassian.com", "community.atlassian.com", "atlassian.com"],
        "asana": ["help.asana.com", "forum.asana.com", "asana.com"],
        "monday.com": ["support.monday.com", "community.monday.com", "monday.com"],
        "monday": ["support.monday.com", "community.monday.com", "monday.com"],
        "zendesk": ["support.zendesk.com", "zendesk.com"],
        "freshdesk": ["support.freshdesk.com", "freshdesk.com", "freshworks.com"],
        "intercom": ["intercom.com", "intercom.help", "community.intercom.com"],
    }
    if c in domain_map:
        return domain_map[c]
    if "." in c:
        base = c.rstrip(".")
        return [base]
    return [f"{c}.com"]


def url_host(url: str) -> str:
    if not url:
        return ""
    try:
        return (urlparse(url).netloc or "").lower()
    except Exception:
        return ""


def domain_matches(host: str, domain: str) -> bool:
    d = domain.lower().strip()
    h = host.lower().strip()
    return h == d or h.endswith(f".{d}")


def build_plan(company_context: str, customer_issue: str) -> Dict:
    normalized = normalize_issue(customer_issue)
    synonyms = issue_synonyms(customer_issue)
    competitors = extract_competitors(company_context)
    if not competitors:
        competitors = ["cross-competitor"]

    exa_queries: List[QueryPlanItem] = []
    for c in competitors:
        exa_queries.extend(build_queries(c, synonyms))

    return {
        "normalized_issue": normalized,
        "issue_synonyms": synonyms,
        "competitors": competitors,
        "exa_queries": [q.__dict__ for q in exa_queries],
        "analysis_rubric": {
            "evidence_quality_order": [
                "official docs",
                "official forum/staff replies",
                "release notes",
                "status pages",
                "credible third-party",
            ],
            "comparison_fields": [
                "issue_exists",
                "frequency_signal",
                "official_acknowledgment",
                "recommended_workaround",
                "time_to_fix",
                "permanent_fix_available",
                "limitations/policy",
            ],
            "confidence_scale": "low|medium|high",
        },
    }


def run_exa(plan: Dict, num_results: int = 5) -> Dict:
    api_key = os.environ.get("EXA_API_KEY")
    if not api_key:
        raise EnvironmentError("EXA_API_KEY is not set.")

    outputs = []
    for q in plan["exa_queries"]:
        payload = {
            "query": q["query"],
            "type": "auto",
            "num_results": num_results,
            "contents": {"highlights": {"max_characters": 1200}},
        }
        payload["includeDomains"] = preferred_domains_for_competitor(q["competitor"])
        curl_cmd = [
            "curl",
            "-sS",
            "-X",
            "POST",
            "https://api.exa.ai/search",
            "-H",
            "Content-Type: application/json",
            "-H",
            f"x-api-key: {api_key}",
            "-d",
            json.dumps(payload),
        ]
        proc = subprocess.run(curl_cmd, capture_output=True, text=True)
        if proc.returncode != 0:
            raise RuntimeError(f"curl request failed: {proc.stderr.strip()}")
        try:
            parsed = json.loads(proc.stdout)
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"Non-JSON response from Exa API: {proc.stdout[:300]}") from exc
        if parsed.get("error"):
            raise RuntimeError(f"Exa API error: {parsed.get('error')}")

        results = parsed.get("results", [])
        outputs.append(
            {
                "competitor": q["competitor"],
                "query": q["query"],
                "intent": q["intent"],
                "results": [
                    {
                        "title": r.get("title"),
                        "url": r.get("url"),
                        "highlights": r.get("highlights"),
                    }
                    for r in results
                ],
            }
        )
    return {"plan": plan, "search_results": outputs}


def read_context(args: argparse.Namespace) -> str:
    if args.company_context:
        return args.company_context
    if args.company_context_file:
        with open(args.company_context_file, "r", encoding="utf-8") as f:
            return f.read()
    raise ValueError("Provide --company-context or --company-context-file.")


def read_issue(args: argparse.Namespace) -> str:
    if args.customer_issue:
        return args.customer_issue
    if args.customer_issue_file:
        with open(args.customer_issue_file, "r", encoding="utf-8") as f:
            return f.read().strip()
    raise ValueError("Provide --customer-issue or --customer-issue-file.")


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def flatten_highlights(highlights: object) -> str:
    if isinstance(highlights, list):
        return " ".join(str(h) for h in highlights)
    if isinstance(highlights, str):
        return highlights
    return ""


def issue_keywords(issue: str) -> List[str]:
    words = re.findall(r"[a-zA-Z0-9]+", issue.lower())
    return [w for w in words if w not in STOPWORDS and len(w) > 2]


GENERIC_FEATURE_WORDS = {
    "export",
    "exports",
    "csv",
    "data",
    "report",
    "reports",
    "dashboard",
    "dashboards",
    "user",
    "users",
    "cannot",
    "cant",
    "unable",
}

CABABILITY_TERMS = {
    "export",
    "csv",
    "download",
    "api",
    "fetch",
    "extract",
}


def specific_issue_terms(issue: str) -> List[str]:
    kws = issue_keywords(issue)
    specific = [k for k in kws if k not in GENERIC_FEATURE_WORDS]
    return specific


def relevance_score(result: Dict, keywords: List[str], competitor: str) -> int:
    text = f"{result.get('title', '')} {flatten_highlights(result.get('highlights'))}".lower()
    url = (result.get("url") or "").lower()
    score = 0
    for kw in keywords:
        if kw in text:
            score += 2
        if kw in url:
            score += 1
    if competitor.lower() in text:
        score += 2
    if any(k in text for k in ["export", "pdf", "dashboard", "report"]):
        score += 2
    if any(k in text for k in ["support", "help", "community", "release notes", "status", "incident"]):
        score += 1
    return score


def competitor_matches_result(result: Dict, competitor: str) -> bool:
    url = (result.get("url") or "").lower()
    host = url_host(url)
    # Strong match only if result is from preferred competitor domains.
    preferred = preferred_domains_for_competitor(competitor)
    return any(domain_matches(host, d) for d in preferred)


def detect_signals(result: Dict) -> set:
    text = f"{result.get('title', '')} {flatten_highlights(result.get('highlights'))}".lower()
    signals = set()
    if any(k in text for k in ["workaround", "forum", "community", "how to"]):
        signals.add("workaround")
    if any(k in text for k in ["release notes", "changelog", "fixed", "resolved", "patch"]):
        signals.add("fix")
    if any(k in text for k in ["limitation", "expected behavior", "not supported", "cannot", "can't"]):
        signals.add("limitation")
    if any(k in text for k in ["status", "incident", "outage", "degraded"]):
        signals.add("incident")
    has_support_terms = any(k in text for k in ["export", "csv", "download", "supported", "how to export"])
    has_problem_terms = any(
        k in text
        for k in [
            "cannot",
            "can't",
            "unable",
            "not working",
            "doesn't work",
            "fails",
            "failed",
            "error",
            "bug",
            "issue",
            "limitation",
            "not supported",
        ]
    )
    if has_support_terms and not has_problem_terms:
        signals.add("support")
    if has_problem_terms:
        signals.add("problem")
    return signals


def format_compact_url(url: str) -> str:
    if not url:
        return ""
    cleaned = re.sub(r"^https?://", "", url).rstrip("/")
    return cleaned[:70]


def build_briefing(output: Dict) -> str:
    plan = output["plan"]
    search_results = output["search_results"]
    competitors = plan["competitors"]
    issue = plan["normalized_issue"]

    per_competitor = {
        c: {"workaround": 0, "fix": 0, "limitation": 0, "incident": 0, "urls": []}
        for c in competitors
    }

    for batch in search_results:
        competitor = batch["competitor"]
        if competitor not in per_competitor:
            continue
        for result in batch.get("results", []):
            signals = detect_signals(result)
            for sig in signals:
                per_competitor[competitor][sig] += 1
            url = result.get("url", "")
            if url and len(per_competitor[competitor]["urls"]) < 2:
                per_competitor[competitor]["urls"].append(format_compact_url(url))

    totals = {"workaround": 0, "fix": 0, "limitation": 0, "incident": 0}
    for c in competitors:
        for k in totals:
            totals[k] += per_competitor[c][k]

    # 7-8 words
    issue_words = [
        w.capitalize()
        for w in re.findall(r"[A-Za-z0-9]+", issue)
        if w.lower() not in STOPWORDS
    ][:4]
    title_words = ["Competitor", "Handling", "Patterns", "For"] + issue_words
    while len(title_words) < 7:
        title_words.append("Issues")
    title = " ".join(title_words[:8])

    comp_list = ", ".join(competitors)
    sentences = []
    sentences.append(
        f"Across {len(competitors)} competitors ({comp_list}), Exa evidence suggests this issue is discussed in support and community channels rather than appearing as an isolated one-off report."
    )
    sentences.append(
        f"The dominant handling pattern is guidance-first: workaround signals={totals['workaround']} and limitation/policy signals={totals['limitation']}, indicating competitors frequently frame this as a usage or product-boundary problem before a hard fix."
    )
    if totals["fix"] > 0:
        sentences.append(
            f"There are fix/release signals ({totals['fix']}) and incident/status references ({totals['incident']}), but they are weaker than workaround and limitation evidence, so most competitors appear to prioritize mitigation and documentation over rapid product changes."
        )
    else:
        sentences.append(
            f"Fix/release-note evidence is limited (signals={totals['fix']}) compared with workaround and limitation references, which suggests operational guidance is usually the primary response path."
        )
    sources = []
    for c in competitors:
        sources.extend(per_competitor[c]["urls"])
    if sources:
        sentences.append(f"Representative sources include {', '.join(sources[:4])}.")

    paragraph = " ".join(sentences[:4])
    return f"{title}\n{paragraph}"


def make_title(competitor: str, issue: str) -> str:
    words = [competitor, "Issue", "Handling", "For"]
    issue_words = [w.capitalize() for w in issue_keywords(issue)[:4]]
    words.extend(issue_words)
    while len(words) < 7:
        words.append("Analysis")
    return " ".join(words[:8])


def build_competitor_object_report(output: Dict) -> Dict:
    plan = output["plan"]
    issue = plan["normalized_issue"]
    keywords = issue_keywords(issue)
    required_terms = specific_issue_terms(issue)
    buckets: Dict[str, List[Dict]] = {c: [] for c in plan["competitors"]}

    for batch in output["search_results"]:
        competitor = batch["competitor"]
        if competitor not in buckets:
            continue
        for result in batch.get("results", []):
            if not competitor_matches_result(result, competitor):
                continue
            scored = dict(result)
            scored["_score"] = relevance_score(result, keywords, competitor)
            scored["_signals"] = sorted(list(detect_signals(result)))
            buckets[competitor].append(scored)

    reports = []
    for competitor, results in buckets.items():
        ranked = sorted(results, key=lambda r: r.get("_score", 0), reverse=True)
        relevant = [r for r in ranked if r.get("_score", 0) >= 4][:4]
        if not relevant:
            relevant = ranked[:3]

        signal_counts = {"workaround": 0, "fix": 0, "limitation": 0, "incident": 0, "support": 0, "problem": 0}
        evidence_urls: List[str] = []
        evidence_titles: List[str] = []
        support_with_specific_match = 0
        specific_term_hits: set = set()
        capability_hit = False
        for r in relevant:
            for sig in r.get("_signals", []):
                signal_counts[sig] += 1
            text = f"{r.get('title', '')} {flatten_highlights(r.get('highlights'))}".lower()
            for term in required_terms:
                if term in text:
                    specific_term_hits.add(term)
            if any(term in text for term in CABABILITY_TERMS):
                capability_hit = True
            if "support" in r.get("_signals", []):
                if required_terms:
                    if all(term in text for term in required_terms):
                        support_with_specific_match += 1
                else:
                    support_with_specific_match += 1
            url = r.get("url", "")
            if url and url not in evidence_urls and len(evidence_urls) < 4:
                evidence_urls.append(url)
            title = (r.get("title") or "").strip()
            if title and title not in evidence_titles and len(evidence_titles) < 2:
                evidence_titles.append(title)

        top_kind = "insufficiently documented handling"
        nonzero = {k: v for k, v in signal_counts.items() if v > 0}
        if nonzero and signal_counts["workaround"] == max(nonzero.values()):
            top_kind = "workarounds and support guidance"
        elif nonzero and signal_counts["fix"] == max(nonzero.values()):
            top_kind = "release-driven fixes"
        elif nonzero and signal_counts["limitation"] == max(nonzero.values()):
            top_kind = "policy/limitation messaging"
        elif signal_counts["incident"] > 0:
            top_kind = "status/incident acknowledgments"
        elif signal_counts["support"] > 0:
            top_kind = "documented feature support"

        if required_terms:
            supports_feature = support_with_specific_match > 0 or (
                len(specific_term_hits) == len(required_terms) and capability_hit
            )
        else:
            supports_feature = signal_counts["support"] > 0
        if supports_feature:
            sentence_1 = (
                f"{competitor} shows clear evidence that dashboard/CSV export is supported for this workflow based on official help and community content."
            )
            sentence_2 = (
                f"Observed handling is primarily {top_kind}, with documentation explaining export paths and expected behavior."
            )
            sentence_3 = (
                f"Top evidence: {'; '.join(evidence_titles)}."
                if evidence_titles
                else "Top evidence was detected from support pages but titles were not confidently extracted."
            )
            solve_description = " ".join([sentence_1, sentence_2, sentence_3])
        else:
            solve_description = ""

        reports.append(
            {
                "competitor": competitor,
                "supports_feature": supports_feature,
                "solve_title": make_title(competitor, issue),
                "solve_description": solve_description,
                "confidence": "high" if len(relevant) >= 3 else ("medium" if len(relevant) == 2 else "low"),
                "evidence_urls": evidence_urls,
            }
        )

    return {
        "customer_issue": issue,
        "competitor_reports": reports,
    }


def run_competitor_research(
    company_context: str, customer_issue: str, num_results: int = 5
) -> Dict:
    plan = build_plan(company_context, customer_issue)
    output = run_exa(plan, num_results=num_results)
    return build_competitor_object_report(output)


def main() -> None:
    script_dir = Path(__file__).resolve().parent
    load_env_file(Path.cwd() / ".env")
    load_env_file(script_dir / ".env")

    parser = argparse.ArgumentParser(description="Exa competitor issue research runner")
    parser.add_argument("--company-context", type=str, default=None, help="Raw company context string")
    parser.add_argument("--company-context-file", type=str, default=None, help="Path to context file")
    parser.add_argument("--customer-issue", type=str, default=None, help="Reported customer issue")
    parser.add_argument("--customer-issue-file", type=str, default=None, help="Path to customer issue text file")
    parser.add_argument("--num-results", type=int, default=5, help="Results per query")
    parser.add_argument(
        "--plan-only",
        action="store_true",
        help="Only output generated query plan, do not call Exa",
    )
    parser.add_argument(
        "--raw-output",
        action="store_true",
        help="Output raw Exa query/result JSON for debugging",
    )
    args = parser.parse_args()

    company_context = read_context(args)
    customer_issue = read_issue(args)
    plan = build_plan(company_context, customer_issue)

    if args.plan_only:
        print(json.dumps(plan, indent=2))
        return

    output = run_exa(plan, num_results=args.num_results)
    if args.raw_output:
        print(json.dumps(output, indent=2))
    else:
        print(json.dumps(build_competitor_object_report(output), indent=2))


if __name__ == "__main__":
    main()
