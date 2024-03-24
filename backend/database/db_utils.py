"""Database CRUD Operations"""

from backend import mongo


# Insert single URL
def insert(url):
    # Create dictionary/object to serve as record
    record = { "url": str(url) }
    # Insert record
    inserted = mongo.db['urls'].insert_one(record)
    return inserted.inserted_id # Returns Object ID
