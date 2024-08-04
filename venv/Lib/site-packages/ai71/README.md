Developers building Python 3.8+ apps can now interact seamlessly with the AI71 API thanks to the ai71 Python library. It includes built-in type checking for both requests and responses, and provides both synchronous and asynchronous HTTP clients powered by httpx.

# Documentation

The API documentation can be found [here](https://api.ai71.ai/redoc).

# Installation
```
pip install ai71
```

# Usage
Define `AI71_API_KEY` environment variable or provide `api_key` in `AI71` and `AsyncAI71`.

```
import os
from ai71 import AI71

client = AI71()

chat_completion = client.chat.completions.create(
    messages=[{"role": "user", "content": "What is your name?"}],
    model="tiiuae/falcon-180B-chat",
)
```

# Async Usage
```
import asyncio

from ai71 import AsyncAI71

client = AsyncAI71()


async def main():
    stream = await client.chat.completions.create(
        messages=[{"role": "user", "content": "What is your name?"}],
        model="tiiuae/falcon-180B-chat",
        stream=True,
    )
    async for chunk in stream:
        print(chunk.choices[0].delta.content or "", end="")


asyncio.run(main())
```