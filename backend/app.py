from flask import Flask


app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")


@app.get("/api")
def api():
    return "just testing again again"


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return app.send_static_file("index.html")
