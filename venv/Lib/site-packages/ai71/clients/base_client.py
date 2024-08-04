from typing import AsyncIterator, Iterable, Mapping, Type, TypeVar

import httpx
import httpx_sse
import pydantic

_ResponseT = TypeVar("_ResponseT", bound=pydantic.BaseModel)


class BaseClient:
    def __init__(
        self,
        headers: Mapping[str, str],
        base_url: httpx.URL,
        timeout: httpx.Timeout,
    ) -> None:
        self._client = httpx.Client(
            headers=headers,
            base_url=base_url,
            timeout=timeout,
        )

    def post(
        self, url: httpx.URL, request: pydantic.BaseModel, cls: Type[_ResponseT]
    ) -> _ResponseT:
        response = self._client.post(
            url,
            json=request.model_dump(),
        )

        if response.status_code != httpx.codes.OK:
            raise self._make_status_error(response)

        return cls.model_validate(response.json())

    def stream(
        self, url: httpx.URL, request: pydantic.BaseModel, cls: Type[_ResponseT]
    ) -> Iterable[_ResponseT]:
        with httpx_sse.connect_sse(
            self._client,
            method="POST",
            url=str(url),
            json=request.model_dump(),
        ) as event_source:
            for response in event_source.iter_sse():
                yield cls.model_validate(response.json())

    def _make_status_error(self, response: httpx.Response) -> Exception:
        raise NotImplementedError()


class AsyncBaseClient:
    def __init__(
        self,
        headers: Mapping[str, str],
        base_url: httpx.URL,
        timeout: httpx.Timeout,
    ) -> None:
        self._client = httpx.AsyncClient(
            headers=headers,
            base_url=base_url,
            timeout=timeout,
        )

    async def post(
        self, url: httpx.URL, request: pydantic.BaseModel, cls: Type[_ResponseT]
    ) -> _ResponseT:
        response = await self._client.post(
            url,
            json=request.model_dump(),
        )

        if response.status_code != httpx.codes.OK:
            raise self._make_status_error(response)

        return cls.model_validate(response.json())

    async def stream(
        self, url: httpx.URL, request: pydantic.BaseModel, cls: Type[_ResponseT]
    ) -> AsyncIterator[_ResponseT]:
        async with httpx_sse.aconnect_sse(
            self._client,
            method="POST",
            url=str(url),
            json=request.model_dump(),
        ) as event_source:
            async for response in event_source.aiter_sse():
                yield cls.model_validate(response.json())

    def _make_status_error(self, response: httpx.Response) -> Exception:
        raise NotImplementedError()
