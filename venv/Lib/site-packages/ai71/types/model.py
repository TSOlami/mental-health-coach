import pydantic
from typing_extensions import Annotated

_UUID_PATTERN = (
    r"[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}"
)
_MODELS = [
    "tiiuae/falcon-180B-chat",
    "tiiuae/falcon-40B",
    "tiiuae/falcon-40B-instruct",
    "tiiuae/falcon-7B",
    "tiiuae/falcon-7B-instruct",
    "tiiuae/falcon-11B-vlm",
    "tiiuae/falcon-11B",
]
_FT_MODELS = (
    model.replace("tiiuae/", "").replace("B", b)
    for model in _MODELS
    for b in ("B", "b")
)
FINETUNE_MODEL_PATTERN = rf"ft:(?P<model>{'|'.join(_FT_MODELS)}):(?<org_id>{_UUID_PATTERN})(?::(?P<suffix>[^:]*))?:(?<uuid>{_UUID_PATTERN})"
_BASE_MODELS = (
    model.replace("/", r"\/").replace("B", b) for model in _MODELS for b in ("B", "b")
)
BASE_MODEL_PATTERN = rf"{'|'.join(_BASE_MODELS)}"
MODEL_PATTERN = rf"^(?:{BASE_MODEL_PATTERN})|(?:{FINETUNE_MODEL_PATTERN})$"
Model = Annotated[str, pydantic.StringConstraints(to_lower=True, pattern=MODEL_PATTERN)]