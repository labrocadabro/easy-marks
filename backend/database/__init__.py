"""Database Endpoints"""

from flask import Blueprint, request, jsonify
from .db_utils import insert
from .db_utils import get_all
from bson.json_util import dumps

db = Blueprint("db", __name__)


@db.post("/insert")
def insert_url():
    url = request.json["url"]
    inserted_id = insert(url)

    if not inserted_id:
        return jsonify({"message": "Could not insert into the database"})

    return jsonify({"inserted_id": str(inserted_id)})


@db.route("/bookmarks")
def get_all_bookmarks():
    bookmarks = get_all()
    return jsonify(dumps(bookmarks))
