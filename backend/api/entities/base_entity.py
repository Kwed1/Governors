import uuid

from pydantic import BaseModel
from sqlalchemy import Column, UUID
from sqlalchemy.orm import DeclarativeBase


class BaseEntity(DeclarativeBase):
    __abstract__ = True
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)