from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from flask_pymongo import PyMongo
from pymongo import ReturnDocument
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os

load_dotenv()


app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
CORS(app)


app.secret_key = os.getenv("SECRET_KEY")
app.config["MONGO_URI"] = os.getenv("MONGODB_URI")
mongo = PyMongo(app)


@app.get("/api")
def api():
    return "just testing again"


@app.post("/login")
def login():
    authorization_code = request.get_json().get("code")
    # get oauth tokens
    token_response = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": authorization_code,
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "client_secret": os.getenv("GOOGLE_SECRET_KEY"),
            "redirect_uri": "postmessage",
            "grant_type": "authorization_code",
        },
    )

    # couldn't get tokens
    if token_response.status_code != 200:
        return jsonify({"success": False})

    token_data = token_response.json()
    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")

    # get profile data from google
    profile_response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    # couldn't get profile data
    if profile_response.status_code != 200:
        return jsonify({"success": False})

    profile_data = profile_response.json()

    # check if the user already exists
    existing_user = mongo.db["user"].find_one({"email": profile_data.get("email")})
    if existing_user:
        # update exiting user with new refresh token
        # also update all profile data, just in case
        user_result = mongo.db["user"].find_one_and_update(
            {"google_id": profile_data.get("sub")},
            {
                "$set": {
                    "refresh_token": refresh_token,
                    "email": profile_data.get("email"),
                    "photo": profile_data.get("picture"),
                    "first_name": profile_data.get("given_name"),
                }
            },
            return_document=ReturnDocument.AFTER,
        )
        user_id = user_result.get("_id")
    else:
        # create new user
        user_result = mongo.db["user"].insert_one(
            {
                "refresh_token": refresh_token,
                "google_id": profile_data.get("sub"),
                "email": profile_data.get("email"),
                "photo": profile_data.get("picture"),
                "first_name": profile_data.get("given_name"),
            }
        )
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


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return app.send_static_file("index.html")


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")


@app.post("/session")
def check_session():
    return valid_session(request)


def valid_session(request):
    access_token = request.headers.get("Authorization")
    print(access_token)
    user_id = request.get_json().get("userId")
    user_data = mongo.db["user"].find_one({"_id": ObjectId(user_id)})

    if not user_data:
        print("user not found")
        return jsonify({"valid": False})

    profile_response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": access_token},
    )

    if profile_response.status_code != 200 and profile_response.status_code != 401:
        print("Access token not valid and not expired, some other error")
        return jsonify({"valid": False})

    # Access token expired
    if profile_response.status_code == 401:
        token_response = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "refresh_token": user_data.get("refresh_token"),
                "client_id": os.getenv("GOOGLE_CLIENT_ID"),
                "client_secret": os.getenv("GOOGLE_SECRET_KEY"),
                "grant_type": "refresh_token",
            },
        )

        if token_response.status_code != 200:
            print("couldn't get new access token")
            return jsonify({"valid": False})

        token_data = token_response.json()
        access_token = token_data.get("access_token")
        profile_response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        if profile_response.status_code != 200:
            print(profile_response)
            print("couldn't get profile data")
            return jsonify({"valid": False})

    profile_data = profile_response.json()

    valid_token = profile_data.get("sub") == user_data.get("google_id")
    if not valid_token:
        print("google id from the profile and from the DB don't match")
        return jsonify({"valid": False})
    else:
        return jsonify(
            {
                "valid": True,
                "photo": profile_data.get("picture"),
                "firstName": profile_data.get("given_name"),
            }
        )
