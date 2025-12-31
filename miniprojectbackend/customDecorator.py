from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, verify_jwt_in_request


def role_required(*required_role):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()

            if claims["role"] not in required_role:
                return jsonify({"message": "Access denied"}), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator
