import strawberry
from typing import List, Optional
from models import SessionLocal, User as UserModel, Post as PostModel, Comment as CommentModel, Like as LikeModel
import bcrypt
import jwt
from datetime import datetime, timedelta
import os

# Секретный ключ для JWT (в реальном приложении хранить в env переменных)
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# --- Типы для аутентификации ---
@strawberry.type
class AuthPayload:
    token: str
    user: 'User'

# --- Типы для дашборда ---
@strawberry.type
class UserStats:
    id: int
    username: str
    post_count: int
    comment_count: int
    like_count: int

@strawberry.type
class Dashboard:
    total_users: int
    total_posts: int
    total_comments: int
    total_likes: int
    user_stats: List[UserStats]

# --- Базовые типы ---
@strawberry.type
class User:
    id: int
    username: str
    icon: str

    @strawberry.field
    def posts(self) -> List['Post']:
        db = SessionLocal()
        posts = db.query(PostModel).filter_by(author_id=self.id).all()
        return [Post(id=p.id, title=p.title, body=p.body, author_id=p.author_id) for p in posts]

@strawberry.type
class Post:
    id: int
    title: str
    body: str
    author_id: int

    @strawberry.field
    def author(self) -> User:
        db = SessionLocal()
        author = db.query(UserModel).filter_by(id=self.author_id).first()
        return User(id=author.id, username=author.username, icon=author.icon)

# --- Вспомогательные функции ---
def hash_password(password: str) -> str:
    """Хеширование пароля"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверка пароля"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict) -> str:
    """Создание JWT токена"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str) -> Optional[UserModel]:
    """Получение пользователя из токена"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
    except jwt.PyJWTError:
        return None
    
    db = SessionLocal()
    user = db.query(UserModel).filter(UserModel.username == username).first()
    return user

# --- Query ---
@strawberry.type
class Query:
    # Users с правильными аргументами
    @strawberry.field
    def users(self, limit: Optional[int] = 10, offset: Optional[int] = 0, username: Optional[str] = None) -> List[User]:
        db = SessionLocal()
        query = db.query(UserModel)
        
        if username:
            query = query.filter(UserModel.username.contains(username))
            
        users = query.offset(offset).limit(limit).all()
        return [User(id=u.id, username=u.username, icon=u.icon) for u in users]

    @strawberry.field
    def user(self, id: int) -> Optional[User]:
        db = SessionLocal()
        user = db.query(UserModel).filter_by(id=id).first()
        if user:
            return User(id=user.id, username=user.username, icon=user.icon)
        return None

    @strawberry.field
    def posts(self, limit: Optional[int] = 10, offset: Optional[int] = 0) -> List[Post]:
        db = SessionLocal()
        posts = db.query(PostModel).offset(offset).limit(limit).all()
        return [Post(id=p.id, title=p.title, body=p.body, author_id=p.author_id) for p in posts]

    @strawberry.field
    def post(self, id: int) -> Optional[Post]:
        db = SessionLocal()
        post = db.query(PostModel).filter_by(id=id).first()
        if post:
            return Post(id=post.id, title=post.title, body=post.body, author_id=post.author_id)
        return None

    @strawberry.field
    def dashboard(self) -> Dashboard:
        db = SessionLocal()
        
        total_users = db.query(UserModel).count()
        total_posts = db.query(PostModel).count()
        total_comments = db.query(CommentModel).count()
        total_likes = db.query(LikeModel).count()
        
        user_stats = []
        users = db.query(UserModel).all()
        
        for user in users:
            post_count = db.query(PostModel).filter_by(author_id=user.id).count()
            comment_count = db.query(CommentModel).filter_by(author_id=user.id).count()
            like_count = db.query(LikeModel).filter_by(author_id=user.id).count()
            
            user_stats.append(UserStats(
                id=user.id,
                username=user.username,
                post_count=post_count,
                comment_count=comment_count,
                like_count=like_count
            ))
        
        return Dashboard(
            total_users=total_users,
            total_posts=total_posts,
            total_comments=total_comments,
            total_likes=total_likes,
            user_stats=user_stats
        )

    @strawberry.field
    def me(self, token: str) -> Optional[User]:
        """Получение текущего пользователя по токену"""
        user = get_current_user(token)
        if user:
            return User(id=user.id, username=user.username, icon=user.icon)
        return None

# --- Mutation ---
@strawberry.type
class Mutation:
    @strawberry.mutation
    def register(self, username: str, password: str, icon: str) -> AuthPayload:
        db = SessionLocal()
        
        # Проверяем, существует ли пользователь
        existing_user = db.query(UserModel).filter(UserModel.username == username).first()
        if existing_user:
            raise Exception("User already exists")
        
        # Хешируем пароль
        hashed_password = hash_password(password)
        
        # Создаем пользователя
        user = UserModel(username=username, password=hashed_password, icon=icon)
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Создаем токен
        access_token = create_access_token(data={"sub": username})
        
        return AuthPayload(
            token=access_token,
            user=User(id=user.id, username=user.username, icon=user.icon)
        )

    @strawberry.mutation
    def login(self, username: str, password: str) -> AuthPayload:
        db = SessionLocal()
        
        # Ищем пользователя
        user = db.query(UserModel).filter(UserModel.username == username).first()
        if not user:
            raise Exception("Invalid credentials")
        
        # Проверяем пароль
        if not verify_password(password, user.password):
            raise Exception("Invalid credentials")
        
        # Создаем токен
        access_token = create_access_token(data={"sub": username})
        
        return AuthPayload(
            token=access_token,
            user=User(id=user.id, username=user.username, icon=user.icon)
        )

    @strawberry.mutation
    def create_user(self, username: str, password: str, icon: str) -> User:
        db = SessionLocal()
        
        # Проверяем, существует ли пользователь
        existing_user = db.query(UserModel).filter(UserModel.username == username).first()
        if existing_user:
            raise Exception("User already exists")
        
        # Хешируем пароль
        hashed_password = hash_password(password)
        
        user = UserModel(username=username, password=hashed_password, icon=icon)
        db.add(user)
        db.commit()
        db.refresh(user)
        return User(id=user.id, username=user.username, icon=user.icon)

    @strawberry.mutation
    def delete_user(self, id: int) -> bool:
        db = SessionLocal()
        user = db.query(UserModel).filter_by(id=id).first()
        if user:
            db.delete(user)
            db.commit()
            return True
        return False

    @strawberry.mutation
    def create_post(self, title: str, body: str, token: str) -> Post:
        """Создание поста (требуется аутентификация)"""
        user = get_current_user(token)
        if not user:
            raise Exception("Not authenticated")
        
        db = SessionLocal()
        post = PostModel(title=title, body=body, author_id=user.id)
        db.add(post)
        db.commit()
        db.refresh(post)
        return Post(id=post.id, title=post.title, body=post.body, author_id=post.author_id)

    @strawberry.mutation
    def create_comment(self, post_id: int, text: str, token: str) -> 'Comment':
        """Создание комментария (требуется аутентификация)"""
        user = get_current_user(token)
        if not user:
            raise Exception("Not authenticated")
        
        db = SessionLocal()
        comment = CommentModel(text=text, post_id=post_id, author_id=user.id)
        db.add(comment)
        db.commit()
        db.refresh(comment)
        return Comment(id=comment.id, text=comment.text, post_id=comment.post_id, author_id=comment.author_id)

    @strawberry.mutation
    def like_post(self, post_id: int, token: str) -> bool:
        """Лайк поста (требуется аутентификация)"""
        user = get_current_user(token)
        if not user:
            raise Exception("Not authenticated")
        
        db = SessionLocal()
        
        # Проверяем, не лайкал ли уже пользователь этот пост
        existing_like = db.query(LikeModel).filter(
            LikeModel.post_id == post_id, 
            LikeModel.author_id == user.id
        ).first()
        
        if existing_like:
            raise Exception("Post already liked")
        
        like = LikeModel(post_id=post_id, author_id=user.id)
        db.add(like)
        db.commit()
        return True

    @strawberry.mutation
    def unlike_post(self, post_id: int, token: str) -> bool:
        """Удаление лайка (требуется аутентификация)"""
        user = get_current_user(token)
        if not user:
            raise Exception("Not authenticated")
        
        db = SessionLocal()
        like = db.query(LikeModel).filter(
            LikeModel.post_id == post_id, 
            LikeModel.author_id == user.id
        ).first()
        
        if like:
            db.delete(like)
            db.commit()
            return True
        return False

# Дополнительные типы для комментариев и лайков
@strawberry.type
class Comment:
    id: int
    text: str
    post_id: int
    author_id: int

    @strawberry.field
    def author(self) -> User:
        db = SessionLocal()
        author = db.query(UserModel).filter_by(id=self.author_id).first()
        return User(id=author.id, username=author.username, icon=author.icon)

@strawberry.type
class Like:
    id: int
    post_id: int
    author_id: int

    @strawberry.field
    def author(self) -> User:
        db = SessionLocal()
        author = db.query(UserModel).filter_by(id=self.author_id).first()
        return User(id=author.id, username=author.username, icon=author.icon)

schema = strawberry.Schema(query=Query, mutation=Mutation)