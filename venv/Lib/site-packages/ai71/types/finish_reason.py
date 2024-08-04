import enum


class FinishReason(str, enum.Enum):
    STOP = "stop"
    LENGTH = "length"
