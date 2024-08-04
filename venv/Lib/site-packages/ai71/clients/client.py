import os
from typing import Optional

import httpx

from .. import exceptions
from ..resources import chat, completions
from . import base_client

# Default timeout is 10 minutes.
DEFAULT_TIMEOUT = httpx.Timeout(600.0)
DEFAULT_URL = httpx.URL("https://api.ai71.ai/v1")


class _ClientMixin:
    _key_variable: str

    def _make_status_error(self, response: httpx.Response) -> exceptions.APIError:
        # TODO: based on code
        return exceptions.APIError()


class Client(_ClientMixin, base_client.BaseClient):
    def __init__(
        self,
        api_key: Optional[str] = None,
        timeout: httpx.Timeout = DEFAULT_TIMEOUT,
        base_url: httpx.URL = DEFAULT_URL,
    ) -> None:
        if api_key is None:
            api_key = os.getenv(self._key_variable)

        self.chat = chat.Chat(self)
        self.completions = completions.Completions(self)

        super().__init__(
            headers={
                "Authorization": f"Bearer {api_key}",
            },
            base_url=base_url,
            timeout=timeout,
        )


class AsyncClient(_ClientMixin, base_client.AsyncBaseClient):
    def __init__(
        self,
        api_key: Optional[str] = None,
        timeout: httpx.Timeout = DEFAULT_TIMEOUT,
        base_url: httpx.URL = DEFAULT_URL,
    ) -> None:
        if api_key is None:
            api_key = os.getenv(self._key_variable)

        self.chat = chat.AsyncChat(self)
        self.completion = completions.AsyncCompletions(self)

        super().__init__(
            headers={
                "Authorization": f"Bearer {api_key}",
            },
            base_url=base_url,
            timeout=timeout,
        )
