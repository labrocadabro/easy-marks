"""Flask Server"""

from flask import Flask, request
from flask_cors import CORS
import db

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
CORS(app)


@app.get("/api")
def api():
    return "just testing again"


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return app.send_static_file("index.html")


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")


### Database Endpoints ###
@app.route("/insert", methods=["POST"])
def insert_bookmark():
    url = request.json['url']
    inserted_id = db.insert(url)

    if not inserted_id:
        return{"DB Error": "Insertion failed."}

    return {"inserted_id": str(inserted_id)}
