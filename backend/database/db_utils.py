"""Database CRUD Ops/Utils"""

from backend import mongo


# Insert bookmark
def insert(url, summary, img_path, embedding, title):
    # Create dictionary/object to serve as record
    record = {
        "url": url,
        "title": title,
        "summary": summary,
        "screenshot": img_path,
        "vectorEmbeddings": embedding,
    }
    # Insert record
    inserted = mongo.db["urls"].insert_one(record)
    return inserted.inserted_id  # Returns Object ID


### Other CRUD Operations will be added here ###

# Helper function to ensure http(s) prefix
def url_prefixer(url):
    # Check URL includes http(s) - to ensure Playwright usability
    if not url.startswith("http://") or not url.startswith("https://"):
        url = "http://" + url
    return url
