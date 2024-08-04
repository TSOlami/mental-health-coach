from ..clients import base_client
from . import chat_completions


class Chat:
    def __init__(self, client: base_client.BaseClient):
        self._client = client
        self.completions = chat_completions.Completions(client)


class AsyncChat:
    def __init__(self, client: base_client.AsyncBaseClient):
        self._client = client
        self.completions = chat_completions.AsyncCompletions(client)
