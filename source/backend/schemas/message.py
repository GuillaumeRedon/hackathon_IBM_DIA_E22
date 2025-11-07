from pydantic import BaseModel
from typing import Literal
from datetime import datetime


class MessageSchema(BaseModel):
    id: datetime
    role: Literal["user", "agent"]
    content: str

class MessageList(BaseModel):
    messages: list[MessageSchema]