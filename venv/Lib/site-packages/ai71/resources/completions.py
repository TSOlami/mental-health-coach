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
from ..types.completion import Completion, CreateCompletion
from ..types.completion_chunk import CompletionChunk
from ..types.model import Model
from . import base_resource


class Completions(base_resource.BaseResource):
    def __init__(self, client: base_client.BaseClient) -> None:
        super().__init__(client)

    @overload
    def create(
        self,
        *,
        prompt: str,
        model: Model,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        stop: Sequence[str] = [],
        max_tokens: Optional[int] = None,
        stream: Literal[False],
        temperature: float = 0.0,
        top_p: float = 1.0,
        top_k: Optional[int] = None,
    ) -> Completion:
        ...

    @overload
    def create(
        self,
        *,
        prompt: str,
        model: Model,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        stop: Sequence[str] = [],
        max_tokens: Optional[int] = None,
        stream: Literal[True],
        temperature: float = 0.0,
        top_p: float = 1.0,
        top_k: Optional[int] = None,
    ) -> Iterator[CompletionChunk]:
        ...

    def create(
        self,
        *,
        prompt: str,
        model: Model,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        stop: Sequence[str] = [],
        max_tokens: Optional[int] = None,
        stream: bool = False,
        temperature: float = 0.0,
        top_p: float = 1.0,
        top_k: Optional[int] = None,
    ) -> Union[Completion, Iterable[CompletionChunk]]:
        create_completion = CreateCompletion(
            prompt=prompt,
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
            return self._post("/completions", create_completion, True, CompletionChunk)
        else:
            return self._post("/completions", create_completion, False, Completion)


class AsyncCompletions(base_resource.AsyncBaseResource):
    def __init__(self, client: base_client.AsyncBaseClient) -> None:
        super().__init__(client)

    @overload
    async def create(
        self,
        *,
        prompt: str,
        model: Model,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        stop: Sequence[str] = [],
        max_tokens: Optional[int] = None,
        stream: Literal[False],
        temperature: float = 0.0,
        top_p: float = 1.0,
        top_k: Optional[int] = None,
    ) -> Completion:
        ...

    @overload
    async def create(
        self,
        *,
        prompt: str,
        model: Model,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        stop: Sequence[str] = [],
        max_tokens: Optional[int] = None,
        stream: Literal[True],
        temperature: float = 0.0,
        top_p: float = 1.0,
        top_k: Optional[int] = None,
    ) -> AsyncIterator[CompletionChunk]:
        ...

    async def create(
        self,
        *,
        prompt: str,
        model: Model,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        stop: Sequence[str] = [],
        max_tokens: Optional[int] = None,
        stream: bool = False,
        temperature: float = 0.0,
        top_p: float = 1.0,
        top_k: Optional[int] = None,
    ) -> Union[Completion, AsyncIterator[CompletionChunk]]:
        create_completion = CreateCompletion(
            prompt=prompt,
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
                "/completions", create_completion, True, CompletionChunk
            )
        else:
            return await self._post(
                "/completions", create_completion, False, Completion
            )
