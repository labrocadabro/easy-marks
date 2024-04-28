"""Database API Endpoints"""

import traceback
from flask import Blueprint, request, jsonify, Response
from bson.json_util import dumps
from backend.embed import embed
from backend.auth.auth_utils import valid_session
from .db_utils import delete, get_all, get_search

db = Blueprint("db", __name__)


# Handle search requests
@db.post("/search")
def search_bookmarks():
    try:
        # this will throw an error if the session isn't valid
        valid_session(request)
        user_id = request.json.get("userId")
        search_criteria = request.json["search"]
        search_embedding = embed(search_criteria)
        bookmarks = get_search(search_embedding, user_id)
        return jsonify(dumps(bookmarks))
    except:
        print(traceback.format_exc())
        return Response(status=500)


# Get all bookmarks for a user
@db.route("/api/user/<user_id>/bookmarks")
def get_all_bookmarks(user_id):
    try:
        # this will throw an error if the session isn't valid
        valid_session(request, user_id)
        bookmarks = get_all(user_id)
        return jsonify(dumps(bookmarks))
    except Exception:
        print(traceback.format_exc())
        return Response(status=500)


# TODO: Make this endpoint
@db.patch("/api/bookmark")
def update_bookmark():
    try:
        # this will throw an error if the session isn't valid
        valid_session(request)
        user_id = request.json.get("userId")
        return Response(status=200)
    except:
        print(traceback.format_exc())
        return Response(status=500)


# Delete a bookmark
@db.delete("/api/bookmark")
def delete_bookmark():
    try:
        # this will throw an error if the session isn't valid
        valid_session(request)
        user_id = request.json.get("userId")
        bookmark_id = request.json["id"]
        delete(bookmark_id, user_id)
        return Response(status=200)
    except:
        print(traceback.format_exc())
        return Response(status=500)
