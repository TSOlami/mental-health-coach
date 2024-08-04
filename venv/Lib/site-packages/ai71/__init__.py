from .clients import client


class _ClientMixin:
    _base_url = "https://api.ai71.ai/v1"
    _key_variable = "AI71_API_KEY"


class AI71(_ClientMixin, client.Client):
    pass


class AsyncAI71(_ClientMixin, client.AsyncClient):
    pass
