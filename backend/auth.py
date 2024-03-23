from flask import Blueprint, request, jsonify
from pymongo import ReturnDocument
from app import mongo
from auth_utils import get_tokens, get_profile_data, valid_session

auth = Blueprint("auth", __name__)


@auth.post("/login")
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

        return jsonify(
            {
                "success": True,
                "userId": str(user_id),
                "accessToken": access_token,
                "photo": profile_data.get("picture"),
                "firstName": profile_data.get("given_name"),
            }
        )
    except Exception as e:
        print(e)
        return jsonify({"success": False})


@auth.post("/session")
def check_session():
    try:
        return jsonify(valid_session(request))
    except Exception as e:
        print(e)
        return jsonify({"valid": False})
