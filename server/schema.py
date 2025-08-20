# schema.py
import strawberry
from typing import List
from models import SessionLocal, User as UserModel, Post as PostModel, Comment as CommentModel, Like as LikeModel

# --- Новые типы для дашборда ---
@strawberry.type
class UserStat:
    id: int
    username: str
    post_count: int
    comment_count: int
    likes_count: int

@strawberry.type
class Dashboard:
    total_users: int
    total_posts: int
    total_comments: int
    total_likes: int
    users: List[UserStat]

#Лайки и (возможно подписики)

@strawberry.type
class Like:
    id: int
    author_id: int

# --- Существующие типы (оставляем как есть) ---
@strawberry.type
class Comment:
    id: int
    text: str

@strawberry.type
class Post:
    id: int
    title: str
    body: str
    comments: List[Comment]
    likes: List[Like]

    @strawberry.field
    def comments(self) -> List[Comment]:
        db = SessionLocal()
        return [
            Comment(id=c.id, text=c.text)
            for c in db.query(CommentModel).filter_by(post_id=self.id).all()
        ]

@strawberry.type
class User:
    id: int
    username: str
    password: str
    icon: str
    posts: List[Post]


    @strawberry.field
    def posts(self, limit: int = 10, offset: int = 0) -> List[Post]:
        db = SessionLocal()
        qs = db.query(PostModel).filter_by(author_id=self.id).limit(limit).offset(offset)
        return [
            Post(id=p.id, title=p.title, body=p.body)
            for p in qs.all()
        ]
# --- Query + Mutation ---
@strawberry.type
class Query:
    @strawberry.field
    def users(self, limit: int = 10, offset: int = 0, username: str = None) -> List[User]:
        db = SessionLocal()
        q = db.query(UserModel)
        if username:
            q = q.filter(UserModel.username.contains(username))
        q = q.limit(limit).offset(offset)
        return [User(id=u.id, username=u.username) for u in q.all()]

    # --- Новый метод дашборда ---
    @strawberry.field
    def dashboard(self) -> Dashboard:
        db = SessionLocal() 
        total_users    = db.query(UserModel).count()
        total_posts    = db.query(PostModel).count()
        total_comments = db.query(CommentModel).count()
        total_likes    = db.query(LikeModel).count()
        # собираем статистику по каждому пользователю
        user_stats = []
        for u in db.query(UserModel).all():
            post_cnt = db.query(PostModel).filter_by(author_id=u.id).count()
            # считаем все комментарии ко всем постам этого пользователя
            comment_cnt = (
                db.query(CommentModel)
                  .join(PostModel, CommentModel.post_id == PostModel.id)
                  .filter(PostModel.author_id == u.id)
                  .count()
            )
            likes_cnt = (
                db.query(LikeModel)
                  .join(PostModel, Like.post_id == PostModel.id)
                  .filter(PostModel.author_id == u.id)
                  .count()
            )
            user_stats.append(
                UserStat(
                    id=u.id,
                    username=u.username,
                    post_count=post_cnt,
                    comment_count=comment_cnt,
                    likes_count=likes_cnt
                )
            )

        return Dashboard(
            total_users=total_users,
            total_posts=total_posts,
            total_comments=total_comments,
            total_likes=total_likes,
            users=user_stats
        )

@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_user(self, username: str, password: str, icon: str) -> User:
        db = SessionLocal()
        u = UserModel(username=username, password=password, icon=icon)
        db.add(u); db.commit(); db.refresh(u)
        return User(id=u.id, username=u.username, password=u.password, icon=u.icon)

    @strawberry.mutation
    def create_post(self, author_id: int, title: str, body: str) -> Post:
        db = SessionLocal()
        p = PostModel(author_id=author_id, title=title, body=body)
        db.add(p); db.commit(); db.refresh(p)
        return Post(id=p.id, title=p.title, body=p.body)

    @strawberry.mutation
    def create_comment(self, post_id: int, author_id: int, text: str) -> Comment:
        db = SessionLocal()
        c = CommentModel(post_id=post_id, text=text, author_id=author_id)
        db.add(c); db.commit(); db.refresh(c)
        return Comment(id=c.id, text=c.text, author_id=c.author_id)
    
    @strawberry.mutation
    def create_like(self, author_id: int) -> Like:
        db = SessionLocal()
        l = LikeModel(author_id=author_id)
        db.add(l); db.commit(); db.refresh(l)
        return Comment(id=l.id, author_id=l.author_id)
    
    @strawberry.mutation
    def delete_user(self, id: int) -> bool:
        #место для гипотетической проверки
        db = SessionLocal()
        try:
            u = db.query(UserModel).filter(UserModel.id == id).first()
            if not u:
                return False
            db.delete(u)
            db.commit()
            return True
        except Exception as error:
            db.rollback()
            raise ValueError("Не удалось удалить пользователя")
        finally:
            db.close()
    
    @strawberry.mutation
    def delete_post(self, id: int) -> bool:
        #место для гипотетической проверки
        db = SessionLocal()
        try:
            u = db.query(PostModel).filter(PostModel.id == id).first()
            if not u:
                return False
            db.delete(u)
            db.commit()
            return True
        except Exception as error:
            db.rollback()
            raise ValueError("Не удалось удалить пост")
        finally:
            db.close()
    
    @strawberry.mutation
    def delete_comment(self, id: int) -> bool:
        #место для гипотетической проверки
        db = SessionLocal()
        try:
            u = db.query(CommentModel).filter(CommentModel.id == id).first()
            if not u:
                return False
            db.delete(u)
            db.commit()
            return True
        except Exception as error:
            db.rollback()
            raise ValueError("Не удалось удалить комментарий")
        finally:
            db.close()

    @strawberry.mutation
    def delete_like(self, id: int) -> bool:
        #место для гипотетической проверки
        db = SessionLocal()
        try:
            u = db.query(LikeModel).filter(LikeModel.id == id).first()
            if not u:
                return False
            db.delete(u)
            db.commit()
            return True
        except Exception as error:
            db.rollback()
            raise ValueError("Не удалось убрать лайк")
        finally:
            db.close()

schema = strawberry.Schema(query=Query, mutation=Mutation)
