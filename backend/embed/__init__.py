"""Embedding Module - Azure OpenAI"""

import os
from openai import AzureOpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Azure OpenAI client
client = AzureOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    api_version="2024-02-01",
    azure_endpoint=os.getenv("OPENAI_AZURE_ENDPOINT"),
)

# Send text to Azure OpenAI for embedding
def embed(text):
    # Max input tokens = 8192
    # Max array input size = 2048
    response = client.embeddings.create(input=text, model="text-embedding-ada-002")
    return response.data[0].embedding
