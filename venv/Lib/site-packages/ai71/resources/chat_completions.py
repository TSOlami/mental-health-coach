from typing import (
    AsyncIterator,
    Iterable,
    Iterator,
    Literal,
    Optional,
    Sequence,
    Union,
    overload,
)

from ..clients import base_client
from ..types.chat_completion import ChatCompletion, CreateChatCompletion
from ..types.chat_completion_chunk import ChatCompletionChunk
from ..types.chat_completion_message import ChatCompletionMessageParam
from ..types.model import Model
from . import base_resource


class Completions(base_resource.BaseResource):
    def __init__(self, client: base_client.BaseClient) -> None:
        super().__init__(client)

    @overload
    def create(
        self,
        *,
        messages: Sequence[ChatCompletionMessageParam],
        model: Model,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        stop: Sequence[str] = [],
        max_tokens: Optional[int] = None,
        stream: Literal[False],
        temperature: float = 0.0,
        top_p: float = 1.0,
        top_k: Optional[int] = None,
    ) -> ChatCompletion:
        ...

    @overload
    def create(
        self,
        *,
        messages: Sequence[ChatCompletionMessageParam],
        model: Model,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        stop: Sequence[str] = [],
        max_tokens: Optional[int] = None,
        stream: Literal[True],
        temperature: float = 0.0,
        top_p: float = 1.0,
        top_k: Optional[int] = None,
    ) -> Iterator[ChatCompletionChunk]:
        ...

    def create(
        self,
        *,
        messages: Sequence[ChatCompletionMessageParam],
        model: Model,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        stop: Sequence[str] = [],
        max_tokens: Optional[int] = None,
        stream: bool = False,
        temperature: float = 0.0,
        top_p: float = 1.0,
        top_k: Optional[int] = None,
    ) -> Union[ChatCompletion, Iterable[ChatCompletionChunk]]:
        create_chat_completion = CreateChatCompletion(
            messages=messages,
            model=model,
            frequency_penalty=frequency_penalty,
            presence_penalty=presence_penalty,
            max_tokens=max_tokens,
            stop=stop,
            stream=stream,
            temperature=temperature,
            top_p=top_p,
            top_k=top_k,
        )
        if stream:
            return self._post(
                "/chat/completions", create_chat_completion, True, ChatCompletionChunk
            )
        else:
            return self._post(
                "/chat/completions", create_chat_completion, False, ChatCompletion
            )


class AsyncCompletions(base_resource.AsyncBaseResource):
    def __init__(self, client: base_client.AsyncBaseClient) -> None:
        super().__init__(client)

    @overload
    async def create(
        self,
        *,
        messages: Sequence[ChatCompletionMessageParam],
        model: Model,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        stop: Sequence[str] = [],
        max_tokens: Optional[int] = None,
        stream: Literal[False],
        temperature: float = 0.0,
        top_p: float = 1.0,
        top_k: Optional[int] = None,
    ) -> ChatCompletion:
        ...

    @overload
    async def create(
        self,
        *,
        messages: Sequence[ChatCompletionMessageParam],
        model: Model,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        stop: Sequence[str] = [],
        max_tokens: Optional[int] = None,
        stream: Literal[True],
        temperature: float = 0.0,
        top_p: float = 1.0,
        top_k: Optional[int] = None,
    ) -> AsyncIterator[ChatCompletionChunk]:
        ...

    async def create(
        self,
        *,
        messages: Sequence[ChatCompletionMessageParam],
        model: Model,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        stop: Sequence[str] = [],
        max_tokens: Optional[int] = None,
        stream: bool = False,
        temperature: float = 0.0,
        top_p: float = 1.0,
        top_k: Optional[int] = None,
    ) -> Union[ChatCompletion, AsyncIterator[ChatCompletionChunk]]:
        create_chat_completion = CreateChatCompletion(
            messages=messages,
            model=model,
            frequency_penalty=frequency_penalty,
            presence_penalty=presence_penalty,
            max_tokens=max_tokens,
            stop=stop,
            stream=stream,
            temperature=temperature,
            top_p=top_p,
            top_k=top_k,
        )
        if stream:
            return await self._post(
                "/chat/completions", create_chat_completion, True, ChatCompletionChunk
            )
        else:
            return await self._post(
                "/chat/completions", create_chat_completion, False, ChatCompletion
            )
