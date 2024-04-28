"""Auth Utility Functions - Token and Session Management"""

import os
import requests
from backend import mongo
from bson.objectid import ObjectId


# Custom Exceptions
class ExternalAPIException(Exception):
    def __init__(self, message):
        super().__init__(message)


class DBException(Exception):
    def __init__(self, message):
        super().__init__(message)


class UserMismatchException(Exception):
    def __init__(self, message):
        super().__init__(message)


# Get tokens from google oauth
def get_tokens(key, type):
    data = {
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_SECRET_KEY"),
    }
    if type == "code":
        data["code"] = key
        data["grant_type"] = "authorization_code"
        data["redirect_uri"] = "postmessage"

    elif type == "refresh":
        data["refresh_token"] = key
        data["grant_type"] = "refresh_token"

    token_response = requests.post("https://oauth2.googleapis.com/token", data)
    if token_response.status_code != 200:
        raise ExternalAPIException("Could not get tokens")
    token_data = token_response.json()
    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")
    return (access_token, refresh_token)


# Get profile data from google oauth
def get_profile_data(access_token, refresh=False, refresh_token=None):
    profile_response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    if refresh:
        if profile_response.status_code != 200 and profile_response.status_code != 401:
            raise ExternalAPIException(
                "Access token not valid and not expired, some other error"
            )
        if profile_response.status_code == 401:
            access_token = get_tokens(refresh_token, "refresh")
            get_profile_data(access_token)

    if profile_response.status_code != 200:
        print(profile_response)
        raise ExternalAPIException("Could not get profile data")

    return profile_response.json()


# Check if the session is valid
def valid_session(request, user_id=None):
    access_token = request.headers.get("Authorization")
    if not user_id:
        user_id = request.json.get("userId")
    user_data = mongo.db["user"].find_one({"_id": ObjectId(user_id)})

    if not user_data:
        raise DBException("user not found")

    profile_data = get_profile_data(
        access_token, refresh=True, refresh_token=user_data.get("refresh_token")
    )

    valid_token = profile_data.get("sub") == user_data.get("google_id")
    if not valid_token:
        raise UserMismatchException(
            "google id from the profile and from the DB don't match"
        )
    else:
        return {
            "photo": profile_data.get("picture"),
            "firstName": profile_data.get("given_name"),
            "accessToken": access_token,
        }
