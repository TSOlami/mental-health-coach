import pydantic


class CompletionUsage(pydantic.BaseModel):
    completion_tokens: int = pydantic.Field(
        description="Number of tokens in the generated response.",
    )
    prompt_tokens: int = pydantic.Field(
        description="Number of tokens in the generated response.",
    )
    total_tokens: int = pydantic.Field(
        description="Total number of tokens in the request and response.",
    )
