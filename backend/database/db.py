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


@db.post("/bulk")
def print_bulk():
    # Store file from incoming request
    file = request.files['file']

    if file:
        # Read lines of file (byte stream)
        content = file.readlines()
        urls = []

        # Decode byte stream to utf-8 and strip newlines and commas
        for line in content:
            urls.append(line.decode('utf-8').strip('\n').strip('\r').strip(','))

        return jsonify({"urls": urls})

    return jsonify({"message": "No file found in request"})
