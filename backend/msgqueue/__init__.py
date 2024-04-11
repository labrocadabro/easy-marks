""" Message queue (send) """

from flask import Blueprint, request, jsonify
from threading import Thread
from backend.database.db_utils import url_prefixer

# from pymongo import ReturnDocument
# from backend import mongo
from .queue_utils import send

queue = Blueprint("queue", __name__)


@queue.post("/api/urls")
def add_urls():
    try:
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
            thread = Thread(target=send, args=(url,))
            thread.start()
        return jsonify({"success": True})
    except:
        return jsonify({"success": False, "message": "No file found in request"})


@queue.post("/api/url")
def add_url():
    try:
        url = url_prefixer(request.json.get("url"))
        thread = Thread(target=send, args=(url,))
        thread.start()
        return jsonify({"success": True})
    except:
        return jsonify({"success": False})
