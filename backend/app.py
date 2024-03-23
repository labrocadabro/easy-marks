from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os

load_dotenv()


app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
CORS(app)


app.config["MONGO_URI"] = os.getenv("MONGODB_URI")
mongo = PyMongo(app)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return app.send_static_file("index.html")


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")


from auth.auth import auth

app.register_blueprint(auth)
