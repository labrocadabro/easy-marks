""" Message queue (send) """

from flask import Blueprint, request, jsonify, Response
from threading import Thread
from backend.database.db_utils import url_prefixer
from backend.auth.auth_utils import valid_session
import traceback

# from pymongo import ReturnDocument
from backend import mongo
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
            # check for existing entry
            bookmark = mongo.db.urls.find_one({"url": url, "user_id": user_id})
            # if the bookmark already exists, don't add to queue
            if bookmark:
                return
            # insert url into database
            inserted = mongo.db.urls.insert_one(
                {"url": url, "user_id": user_id, "status": "pending"}
            )
            bookmark_id = str(inserted.inserted_id)
            # put url in message queue
            thread = Thread(target=send, args=(url, user_id, bookmark_id))
            thread.start()
        return Response(status=200)
    except:
        print(traceback.format_exc())
        return Response(status=500)


@queue.post("/api/url")
def add_url():
    try:
        user_id = request.json.get("userId")
        # this will throw an error if the session isn't valid
        valid_session(request)
        url = url_prefixer(request.json.get("url"))
        ## insert url into database
        inserted = mongo.db["urls"].insert_one(
            {"url": url, "user_id": user_id, "status": "pending"}
        )
        bookmark_id = str(inserted.inserted_id)
        # put url in message queue
        thread = Thread(target=send, args=(url, user_id, bookmark_id))
        thread.start()
        return Response(status=200)
    except:
        print(traceback.format_exc())
        return Response(status=500)
