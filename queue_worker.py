# send url to scraping > get back text and screenshot > send text to summarization > send text or summary to embedding > send everything for inserting
# send url to scraping > get back text and screenshot > send text to summarization > send text or summary to embedding > send everything for inserting
""" Message queue (receive) """

import pika
import os
from dotenv import load_dotenv
from backend.scraping import get_website_data
from backend.summarize import summarize
from backend.embed import embed
from backend.database.db_utils import insert

load_dotenv()


url = os.getenv("CLOUDAMQP_URL")
params = pika.URLParameters(url)
print(params)

connection = pika.BlockingConnection(params)
channel = connection.channel()
channel.queue_declare(queue="hello")


def callback(ch, method, properties, body):
    url = body.decode("utf-8")
    # title, text, screenshot = get_website_data(url)
    # summary = summarize(text)
    # embedding = embed(text)
    # insert(url, summary, screenshot, embedding, title)
    print(f" [x] Inserted {url}")


channel.basic_consume(queue="hello", auto_ack=True, on_message_callback=callback)
print("beginning consume")
channel.start_consuming()
