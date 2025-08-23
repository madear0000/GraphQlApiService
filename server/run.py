from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from schema import schema

# Создаем FastAPI приложение
app = FastAPI()

# CORS middleware - разрешаем все для разработки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем все origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Создаем GraphQL роутер
graphql_app = GraphQLRouter(schema)

# Подключаем GraphQL
app.include_router(graphql_app, prefix="/graphql")

# Эндпоинт для просмотра схемы
@app.get("/schema")
async def get_schema():
    schema_str = str(schema)
    return {"schema": schema_str}

# Тестовый endpoint
@app.get("/")
async def root():
    return {"message": "GraphQL API Server is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Обработчик OPTIONS запросов для CORS
@app.options("/{rest_of_path:path}")
async def options_handler(rest_of_path: str):
    return {"message": "CORS preflight handled"}

# Добавляем это условие для запуска напрямую
if __name__ == "__main__":
    import uvicorn
    # Запускаем без reload при прямом выполнении
    uvicorn.run("run:app", host="0.0.0.0", port=8000)