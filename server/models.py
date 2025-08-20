from sqlalchemy import Column, Integer, String, Text, ForeignKey, create_engine, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
'''from datetime import datetime'''

Base = declarative_base()
engine = create_engine("sqlite:///db.sqlite3", echo=False)
SessionLocal = sessionmaker(bind=engine)

class User(Base):
    __tablename__ = "users"
    id       = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    icon     = Column(String, nullable=False)
    posts    = relationship("Post", back_populates="author")
    comments = relationship("Comment", back_populates="author")
    likes    = relationship("Like", back_populates="author")

class Post(Base):
    __tablename__ = "posts"
    id        = Column(Integer, primary_key=True)
    title     = Column(String, nullable=False)
    body      = Column(Text,   nullable=False)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    author    = relationship("User", back_populates="posts")
    comments  = relationship("Comment", back_populates="post")
    likes     = relationship("Like", back_populates="post")

class Comment(Base):
    __tablename__ = "comments"
    id      = Column(Integer, primary_key=True)
    text    = Column(Text, nullable=False)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"))
    author_id  = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    post    = relationship("Post", back_populates="comments")
    author = relationship("User", back_populates="comments")
    

class Like(Base):
    __tablename__ = "likes"
    id        = Column(Integer, primary_key=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    post_id   = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"))
    author    = relationship("User", back_populates="likes")
    post      = relationship("Post", back_populates="likes")

Base.metadata.create_all(engine)
