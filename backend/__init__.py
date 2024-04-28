"""Main module of the Flask Server"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import load_dotenv


# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
CORS(app)

# Initialize MongoDB
app.config["MONGO_URI"] = os.getenv("MONGODB_URI")
mongo = PyMongo(app)


# Default route to serve the frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return app.send_static_file("index.html")

# Error handler for 404
@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")


### These must be at the EOF to avoid circular imports ###
# Import blueprints
from .auth import auth
from .database import db
from .msgqueue import queue

# Register blueprints
app.register_blueprint(auth)
app.register_blueprint(db)
app.register_blueprint(queue)
