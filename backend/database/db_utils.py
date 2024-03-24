"""Database CRUD Ops/Utils"""

from backend import mongo


# Insert single URL
# This will be relaced with a function that inserts the whole record after embedding/summarization
def insert(url):
    # Create dictionary/object to serve as record
    record = { "url": str(url) }
    # Insert record
    inserted = mongo.db['urls'].insert_one(record)
    return inserted.inserted_id # Returns Object ID

### Other CRUD Operations will be added here ###
