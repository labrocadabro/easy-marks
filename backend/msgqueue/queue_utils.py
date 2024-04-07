import pika
from dotenv import load_dotenv

load_dotenv()
import os
import time

url = os.getenv("CLOUDAMQP_URL")
params = pika.URLParameters(url)


def send(urls):
    connection = pika.BlockingConnection(params)
    channel = connection.channel()  # start a channel
    channel.queue_declare(queue="hello")  # Declare a queue
    for url in urls:
        channel.basic_publish(exchange="", routing_key="hello", body=url)
        print(f" [x] Sent {url}")
        time.sleep(1)
    connection.close()
