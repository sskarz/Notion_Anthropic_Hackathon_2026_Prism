"""Helpers to convert Python values into Notion property format dicts."""

from typing import Any


def map_title(text: str) -> dict[str, Any]:
    return {"title": [{"text": {"content": text}}]}


def map_rich_text(text: str) -> dict[str, Any]:
    return {"rich_text": [{"text": {"content": text}}]}


def map_select(name: str) -> dict[str, Any]:
    return {"select": {"name": name}}


def map_url(url: str) -> dict[str, Any]:
    return {"url": url}


def map_checkbox(val: bool) -> dict[str, Any]:
    return {"checkbox": val}


def map_relation(page_ids: list[str]) -> dict[str, Any]:
    return {"relation": [{"id": pid} for pid in page_ids]}
