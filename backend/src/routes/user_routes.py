from fastapi import APIRouter
from models.user import User
from controllers.user_controller import get_user_list, create_user

user_router = APIRouter(tags=["Users"])

@user_router.get("/")
def list_users():
    return get_user_list()

@user_router.post("/")
def add_user(user: User):
    return create_user(user)