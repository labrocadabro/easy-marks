# send url to scraping > get back text and screenshot > send text to summarization > send text or summary to embedding > send everything for inserting
# send url to scraping > get back text and screenshot > send text to summarization > send text or summary to embedding > send everything for inserting
""" Message queue (receive) """

import pika
import os
from dotenv import load_dotenv

from backend.scraping import get_website_data
from backend.summarize import summarize
from backend.embed import embed
from backend.database.db_utils import update, delete

load_dotenv()


mq_url = os.getenv("CLOUDAMQP_URL")
params = pika.URLParameters(mq_url)

connection = pika.BlockingConnection(params)
channel = connection.channel()
channel.queue_declare(queue="bookmarks")


def trim_left(img_path):
    index = img_path.find("/frontend")
    if index != -1:
        return img_path[index:]
    else:
        return img_path


def callback(ch, method, properties, body):
    try:
        url, user_id, bookmark_id = body.decode("utf-8").split(",")
        title, text, screenshot = get_website_data(url)
        img_path = trim_left(str(screenshot))
        summary = summarize(text)
        embedding = embed(text)
        update(bookmark_id, user_id, url, summary, img_path, embedding, title)
        print(f" [x] Inserted {url}")
    except Exception as e:
        print(e)
        print(f" [x] Failed to insert {url}")
        delete(bookmark_id, user_id)


channel.basic_consume(queue="bookmarks", auto_ack=True, on_message_callback=callback)
print("beginning consume")
channel.start_consuming()
