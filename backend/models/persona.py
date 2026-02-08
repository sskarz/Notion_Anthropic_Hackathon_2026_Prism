from typing import Literal

from pydantic import BaseModel


CommunicationStyle = Literal["Analytical", "Narrative", "Terse", "Verbose"]


class PersonaCreate(BaseModel):
    persona_type: str
    primary_use_case: str
    communication_style: CommunicationStyle
    goals: str
    constraints: str


class Persona(PersonaCreate):
    id: str
    created_time: str
