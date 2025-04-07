from models.user import User

def get_user_list():
    return [
        User(id=1, name="Alice", email="alice@example.com"),
        User(id=2, name="Bob", email="bob@example.com")
    ]

def create_user(user: User):
    # Dummy creation logic
    return {"message": f"User {user.name} created!", "user": user}