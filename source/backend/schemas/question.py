from pydantic import BaseModel
from typing import Literal, Optional

class QuestionSchema(BaseModel):
    titre: str
    contenu: str
    thematique: Optional[str] = ""
    ecoles: Literal['IIM', 'EXECUTIVE', 'EMLV', 'ESILV']
    utilisateurs: Literal['faculty-en', 'anonymous', 'staff', 'student', 'staff-en', 'student-en', 'faculty']
    langue: Literal["Français", "English"]