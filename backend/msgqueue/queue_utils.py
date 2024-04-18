"""Queue Utils module for sending messages to the queue."""

import os
import pika
from dotenv import load_dotenv


# Load environment variables
load_dotenv()

mq_url = os.getenv("CLOUDAMQP_URL")
params = pika.URLParameters(mq_url)

# Send a message to the queue
def send(url, user_id, bookmark_id):
    connection = pika.BlockingConnection(params)
    channel = connection.channel()  # start a channel
    channel.queue_declare(queue="bookmarks")  # Declare a queue
    channel.basic_publish(
        exchange="", routing_key="bookmarks", body=f"{url},{user_id},{bookmark_id}"
    )
    print(f" [x] Sent {url}")
    connection.close()
