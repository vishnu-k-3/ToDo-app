from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("mongodb://localhost:27017/")
db = client.todo_database

class TodoItem(BaseModel):
    title: str
    completed: bool = False

@app.get("/todos/")
async def get_todos():
    todos = list(db.todos.find({}, {"_id": 1, "title": 1, "completed": 1}))
    for todo in todos:
        todo["_id"] = str(todo["_id"])
    return todos

@app.post("/todos/")
async def create_todo(item: TodoItem):
    result = db.todos.insert_one(item.dict())
    if result.inserted_id:
        return {"_id": str(result.inserted_id), "title": item.title, "completed": item.completed}
    else:
        raise HTTPException(status_code=400, detail="Failed to add todo item")

@app.put("/todos/{id}")
async def update_todo(id: str, item: TodoItem):
    result = db.todos.update_one({"_id": ObjectId(id)}, {"$set": item.dict()})
    if result.modified_count == 1:
        return {"_id": id, "title": item.title, "completed": item.completed}
    else:
        raise HTTPException(status_code=400, detail="Failed to update todo item")

@app.delete("/todos/{id}")
async def delete_todo(id: str):
    result = db.todos.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return {"message": "Todo item deleted successfully"}
    else:
        raise HTTPException(status_code=400, detail="Failed to delete todo item")
