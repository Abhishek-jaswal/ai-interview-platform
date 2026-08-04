from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    checks = relationship("ResumeCheck", back_populates="owner", cascade="all, delete-orphan")


class ResumeCheck(Base):
    __tablename__ = "resume_checks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    score = Column(Float, nullable=True)
    summary = Column(Text, nullable=True)
    result_json = Column(Text, nullable=False)  # full structured AI response
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="checks")
