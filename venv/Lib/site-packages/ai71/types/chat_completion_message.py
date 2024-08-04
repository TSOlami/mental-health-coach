import enum
from typing import Optional

import pydantic


class Role(str, enum.Enum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


class ChatCompletionMessage(pydantic.BaseModel):
    content: Optional[str] = None
    role: Optional[Role] = None


class ChatCompletionMessageParam(pydantic.BaseModel):
    content: str
    role: Role
