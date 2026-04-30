"""
MongoDB document shape for the 'users' collection.

{
    "_id":      ObjectId,
    "name":     str,
    "email":    str,          # unique
    "password": bytes,        # bcrypt hash
    "role":     str,          # "admin" | "manager"
}
"""
