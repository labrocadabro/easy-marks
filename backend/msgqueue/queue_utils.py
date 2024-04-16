import pika
from dotenv import load_dotenv

load_dotenv()
import os

mq_url = os.getenv("CLOUDAMQP_URL")
params = pika.URLParameters(mq_url)


def send(url, user_id, bookmark_id):
    connection = pika.BlockingConnection(params)
    channel = connection.channel()  # start a channel
    channel.queue_declare(queue="bookmarks")  # Declare a queue
    channel.basic_publish(
        exchange="", routing_key="bookmarks", body=f"{url},{user_id},{bookmark_id}"
    )
    print(f" [x] Sent {url}")
    connection.close()
