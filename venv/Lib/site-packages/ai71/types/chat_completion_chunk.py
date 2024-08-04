from typing import Literal, Optional, Sequence

import pydantic

from ..types.chat_completion_message import ChatCompletionMessage
from ..types.completion_usage import CompletionUsage
from ..types.finish_reason import FinishReason


class Choice(pydantic.BaseModel):
    delta: ChatCompletionMessage
    finish_reason: Optional[FinishReason]
    index: int


class ChatCompletionChunk(pydantic.BaseModel):
    id: str
    choices: Sequence[Choice]
    created: int
    model: str
    object: Literal["chat.completion.chunk"]
    system_fingerprint: Optional[str] = None
    usage: CompletionUsage
