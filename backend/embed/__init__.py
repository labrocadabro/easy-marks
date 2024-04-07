"""Embedding Module - Azure OpenAI"""

import os
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AzureOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    api_version="2024-04-02",
    azure_endpoint=os.getenv("OPENAI_AZURE_ENDPOINT"),
)


# Max input tokens = 8192
# Max array input size = 2048
def embed(text):
    response = client.embeddings.create(input=text, model="text-embedding-ada-002")
    return response
