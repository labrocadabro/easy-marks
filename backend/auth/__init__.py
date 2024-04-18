"""Auth Endpoints - Login and Session Check"""

from flask import Blueprint, request, jsonify, Response
from pymongo import ReturnDocument
from backend import mongo
from .auth_utils import get_tokens, get_profile_data, valid_session
import traceback

auth = Blueprint("auth", __name__)


# Attempt to login with google oauth
@auth.post("/auth/login")
def login():
    try:
        authorization_code = request.get_json().get("code")
        # get oauth tokens
        access_token, refresh_token = get_tokens(authorization_code, "code")

        # get profile data from google
        profile_data = get_profile_data(access_token)

        user_data = {
            "refresh_token": refresh_token,
            "email": profile_data.get("email"),
            "photo": profile_data.get("picture"),
            "first_name": profile_data.get("given_name"),
        }
        # check if the user already exists
        existing_user = mongo.db["user"].find_one(
            {"google_id": profile_data.get("sub")}
        )
        if existing_user:
            # update exiting user with new refresh token
            # also update all profile data, just in case
            user_result = mongo.db["user"].find_one_and_update(
                {"google_id": profile_data.get("sub")},
                {"$set": user_data},
                return_document=ReturnDocument.AFTER,
            )
            user_id = user_result.get("_id")
        else:
            # create new user
            user_data["google_id"] = profile_data.get("sub")
            user_result = mongo.db["user"].insert_one(user_data)
            user_id = user_result.inserted_id
        print(user_id, access_token, profile_data)
        return jsonify(
            {
                "userId": str(user_id),
                "accessToken": access_token,
                "photo": profile_data.get("picture"),
                "firstName": profile_data.get("given_name"),
            }
        )
    except:
        print(traceback.format_exc())
        return Response(status=500)

# Check if the session is valid
@auth.post("/auth/session")
def check_session():
    try:
        return jsonify(valid_session(request))
    except:
        print(traceback.format_exc())
        return Response(status=500)
