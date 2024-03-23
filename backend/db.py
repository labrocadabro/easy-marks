"""Database CRUD Operations"""

import pymongo
import dbkey # Stores URI string for connecting to MongoDB

# Database Constants
CLIENT = pymongo.MongoClient(dbkey.URI) # Connect to MongoDB
DB = CLIENT["test_bookmarks"] # Database to use
COLLECTION = DB["urls"] # Collection to use


### CRUD Operations ###

# Insert single URL
def insert(url):
    # Create dictionary/object to serve as record
    record = { "url": str(url) }
    # Insert record
    inserted = COLLECTION.insert_one(record)
    return inserted.inserted_id # Returns Object ID
