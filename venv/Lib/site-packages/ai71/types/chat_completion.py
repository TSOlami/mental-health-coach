from typing import Literal, Sequence

import pydantic

from ..types.chat_completion_message import (
    ChatCompletionMessage,
    ChatCompletionMessageParam,
)
from ..types.completion import CommonChoice, CommonCompletion, CommonCreateCompletion


class _CreateChatCompletion(pydantic.BaseModel):
    messages: Sequence[ChatCompletionMessageParam] = pydantic.Field(
        description="A sequence of chat messages constituting the current dialog.",
    )


class CreateChatCompletion(CommonCreateCompletion, _CreateChatCompletion):
    pass


class Choice(CommonChoice):
    message: ChatCompletionMessage = pydantic.Field(
        description="Generated chat response.",
    )


class ChatCompletion(CommonCompletion):
    choices: Sequence[Choice] = pydantic.Field(
        default="A list of generated chat responses."
    )
    object: Literal["chat.completion"] = pydantic.Field(
        description="Constant `chat.completion`"
    )
