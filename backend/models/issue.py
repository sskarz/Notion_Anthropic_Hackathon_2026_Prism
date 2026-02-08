from typing import Literal

from pydantic import BaseModel


IssueType = Literal["Pain Point", "Feature Request", "Workflow Gap", "Unmet Need"]
Severity = Literal["Critical", "High", "Medium", "Low"]
GraphType = Literal["Bar", "Trend", "Heatmap", "None"]


class IssueCreate(BaseModel):
    issue_title: str
    issue_type: IssueType
    issue_details: str
    severity: Severity
    time: str = ""
    graph_data: str = ""
    related_persona_id: str | None = None
    related_quote_ids: list[str] = []


class Issue(IssueCreate):
    id: str
    created_time: str
    engineer_matching: str = ""
    graph_type: GraphType | None = None
    exa_trigger: bool = False
    graph_data: str = ""
