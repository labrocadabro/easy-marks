"""Database Endpoints"""

from flask import Blueprint, request, jsonify
from bson.json_util import dumps
from backend.embed import embed
from .db_utils import insert, delete, get_all, get_search

db = Blueprint("db", __name__)


@db.post("/search")
def search_bookmarks():
    search_criteria = request.json["search"]
    search_embedding = embed(search_criteria)
    bookmarks = get_search(search_embedding)
    return jsonify(dumps(bookmarks))


@db.route("/api/bookmarks")
def get_all_bookmarks():
    bookmarks = get_all()
    return jsonify(dumps(bookmarks))


# TODO: Make this endpoint
@db.patch("/api/bookmark")
def update_bookmark():
    try:
        return jsonify({"updated": True})
    except Exception as e:
        print(e)
        return jsonify({"updated": False})


@db.delete("/api/bookmark")
def delete_bookmark():
    try:
        bookmark_id = request.json["id"]
        deleted = delete(bookmark_id)
        return jsonify({"deleted": True})
    except Exception as e:
        print(e)
        return jsonify({"deleted": False})
