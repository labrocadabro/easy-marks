"""Database CRUD Ops/Utils"""

from bson import ObjectId
from backend import mongo


# Insert bookmark
def insert(user_id, url, summary, img_path, embedding, title):
    # Create dictionary/object to serve as record
    record = {
        "user_id": user_id,
        "url": url,
        "title": title,
        "summary": summary,
        "screenshot": img_path,
        "vectorEmbeddings": embedding,
    }
    # Insert record
    inserted = mongo.db["urls"].insert_one(record)
    return inserted.inserted_id  # Returns Object ID


# Update bookmark
def update(bookmark_id, user_id, url, summary, img_path, embedding, title):
    return mongo.db.urls.update_one(
        {
            "_id": ObjectId(bookmark_id),
            "user_id": user_id,
        },
        {
            "$set": {
                "url": url,
                "title": title,
                "summary": summary,
                "screenshot": img_path,
                "vectorEmbeddings": embedding,
                "status": "complete",
            }
        },
        upsert=True,
    )


# Delete bookmark
def delete(bookmark_id, user_id):
    # Delete bookmark by ID
    return mongo.db.urls.delete_one({"_id": ObjectId(bookmark_id), "user_id": user_id})


# Get all bookmarks
def get_all(user_id):
    # Pipeline to convert ObjectID to string for use in frontend
    pipeline = [
        {"$match": {"user_id": user_id}},
        {
            "$project": {
                "id": {"$toString": "$_id"},
                "_id": 0,
                "title": 1,
                "url": 1,
                "summary": 1,
                "screenshot": 1,
                "status": 1,
            },
        },
    ]
    return mongo.db.urls.aggregate(pipeline)


# Search bookmarks using vector embeddings (similarity search)
def get_search(query_vector, user_id):
    # Define pipeline
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vectorIndex",
                "path": "vectorEmbeddings",
                "queryVector": query_vector,
                "numCandidates": 20,
                "limit": 20,
                "filter": {"user_id": {"$eq": user_id}},
            },
        },
        {
            "$project": {
                "id": {"$toString": "$_id"},
                "_id": 0,
                "title": 1,
                "url": 1,
                "summary": 1,
                "screenshot": 1,
                "status": 1,
                "score": {
                    # Include search score in result set
                    "$meta": "vectorSearchScore"
                },
            }
        },
    ]

    # Return search results
    return mongo.db.urls.aggregate(pipeline)


# Helper function to ensure http(s) prefix
def url_prefixer(url):
    # Check URL includes http(s) - to ensure Playwright usability
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "http://" + url
    return url
