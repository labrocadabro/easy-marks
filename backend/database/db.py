"""Database Endpoints"""

from flask import Blueprint, request, jsonify
from .db_utils import insert

db = Blueprint("db", __name__)


@db.post("/insert")
def insert_url():
    url = request.json['url']
    inserted_id = insert(url)

    if not inserted_id:
        return jsonify({"message": "Could not insert into the database"})

    return jsonify({"inserted_id": str(inserted_id)})
