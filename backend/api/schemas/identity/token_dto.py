from pydantic import BaseModel


class TokenDto(BaseModel):
    token: str
