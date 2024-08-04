from typing import List, Literal, Optional, Sequence

import annotated_types
import pydantic
from typing_extensions import Annotated

from ..types.completion_usage import CompletionUsage
from ..types.finish_reason import FinishReason
from ..types.model import Model


class CommonCreateCompletion(pydantic.BaseModel):
    model: Model = pydantic.Field(description="The identifier of the model to use.")
    stream: bool = pydantic.Field(
        default=False,
        description="Enables sending tokens via streaming mode using server-sent events.",
    )
    max_tokens: Optional[int] = pydantic.Field(
        default=None,
        description="The upper limit on the number of tokens in the generated output.",
    )
    stop: Annotated[List[str], annotated_types.Len(max_length=8)] = pydantic.Field(
        default=[],
        description="A list of up to 8 tokens that, if encountered, will terminate the text generation.",
    )
    temperature: pydantic.NonNegativeFloat = pydantic.Field(
        default=0.0,
        description="Adjusts the probability distribution of token selection using a temperature. Higher values favor less predictable, diverse outputs, while lower values prioritize deterministic choices.",
    )
    frequency_penalty: float = pydantic.Field(
        default=0.0,
        description="The higher this value, the more it encourages variety by making the model less likely to repeat frequently used words or phrases.",
    )
    presence_penalty: float = pydantic.Field(
        default=0.0,
        description="The higher this value, the more it encourages variety by making the model less likely to repeat words or phrases which were already used (regardless of how frequently they were used).",
    )
    top_p: float = pydantic.Field(
        default=1.0,
        gt=0.0,
        le=1.0,
        description="Enables nucleus sampling by restricting the model to tokens within the cumulative probability mass defined by `top_p`.",
    )
    top_k: Optional[pydantic.PositiveInt] = pydantic.Field(
        default=None,
        description="Restricts token selection to the `top_k` most probable candidates according to the model predictions.",
    )


class _CreateCompletion(pydantic.BaseModel):
    prompt: str = pydantic.Field(
        description="Defines the initial context for auto regressive text generation.",
    )


class CreateCompletion(CommonCreateCompletion, _CreateCompletion):
    pass


class CommonChoice(pydantic.BaseModel):
    finish_reason: FinishReason = pydantic.Field(
        description="Specifies the reason for the token generation termination, indicating either a natural stopping point `stop` or a reach of a maximum token count constraint.",
    )
    index: int = pydantic.Field(
        description="The position of the choice in the choices array.",
    )


class Choice(CommonChoice):
    text: str = pydantic.Field(
        description="Generated text response.",
    )


class CommonCompletion(pydantic.BaseModel):
    id: str = pydantic.Field(
        description="A unique identifier that serves as a reference for the generated completion."
    )
    created: int = pydantic.Field(
        description="A Unix timestamp, indicating the time of completion creation."
    )
    model: str = pydantic.Field(
        description="Identifier of the model used to create the completion."
    )
    usage: Optional[CompletionUsage] = pydantic.Field(
        description="Identifier of the model used to create the completion."
    )


class Completion(CommonCompletion):
    choices: Sequence[Choice] = pydantic.Field(
        default="A list of generated text responses."
    )
    object: Literal["completion"] = pydantic.Field(description="Constant `completion`")
