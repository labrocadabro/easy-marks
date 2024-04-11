""" Message queue (send) """

from flask import Blueprint, request, jsonify
from threading import Thread
from backend.database.db_utils import url_prefixer
from backend.auth.auth_utils import valid_session

# from pymongo import ReturnDocument
# from backend import mongo
from .queue_utils import send

queue = Blueprint("queue", __name__)


@queue.post("/api/urls")
def add_urls():
    try:
        # this will throw an error if the session isn't valid
        valid_session(request)
        user_id = request.json.get("userId")
        # process file to get URLs
        # Store file from incoming request
        file = request.files["file"]

        if file:
            # Read file and convert to utf-8
            content = file.read().decode("utf-8")
            urls = []
            for line in content.splitlines():
                urls.append(line)
        for url in urls:
            url = url_prefixer(url)
            thread = Thread(target=send, args=(url, user_id))
            thread.start()
        return jsonify({"success": True})
    except:
        return jsonify({"success": False, "message": "No file found in request"})


@queue.post("/api/url")
def add_url():
    try:
        user_id = request.json.get("userId")
        # this will throw an error if the session isn't valid
        valid_session(request)
        url = url_prefixer(request.json.get("url"))
        thread = Thread(target=send, args=(url, user_id))
        thread.start()
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"success": False})
