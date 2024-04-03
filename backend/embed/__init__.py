"""Embedding Module - Azure OpenAI"""

import os
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()

def embed(text):
    client = AzureOpenAI(
        api_key=os.getenv("AZURE_EMBEDDING_API_KEY"),
        api_version="2024-02-01",
        azure_endpoint=os.getenv("AZURE_EMBEDDING_ENDPOINT")
    )

    # Max input tokens = 8192
    # Max array input size = 2048
    response = client.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )

    return response
