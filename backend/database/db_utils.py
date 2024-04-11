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


# Get all bookmarks
def get_all():
    fields = {"_id": 1, "title": 1, "url": 1, "summary": 1, "screenshot": 1}
    return mongo.db.urls.find({}, fields)


def get_search(query_vector):
    # Define pipeline
    pipeline = [
        {
            '$vectorSearch': {
                'index': 'vectorIndex', 
                'path': 'vectorEmbeddings', 
                'queryVector': query_vector, 
                'numCandidates': 20, 
                'limit': 20
            }
        },
        {
            '$project': {
            '_id': 1,
            'title': 1,
            'url': 1,
            'summary': 1,
            'screenshot': 1,
            'score': {
                # Include search score in result set
                '$meta': 'vectorSearchScore'
                }
            }
        }
    ]

    # Return search results
    return mongo.db.urls.aggregate(pipeline)

# Helper function to ensure http(s) prefix
def url_prefixer(url):
    # Check URL includes http(s) - to ensure Playwright usability
    if not url.startswith("http://") or not url.startswith("https://"):
        url = "http://" + url
    return url
