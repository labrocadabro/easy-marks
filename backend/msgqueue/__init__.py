""" Message queue (send) """

from flask import Blueprint, request, jsonify

# from pymongo import ReturnDocument
# from backend import mongo
from .queue_utils import send

queue = Blueprint("queue", __name__)


@queue.post("/urls")
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
            send(url)
        return jsonify({"success": True})
    except:
        return jsonify({"success": False, "message": "No file found in request"})


@queue.post("/url")
def add_url():
    try:
        print(request)
        url = request.json.get("url")
        print("url", url)
        # send(url)
        print(f" [x] sent {url}")
        return "success"
    except:
        return "failure"
