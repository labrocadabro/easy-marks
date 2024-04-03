# receive text, send back summary
import os
from azure.ai.textanalytics import TextAnalyticsClient, AbstractiveSummaryAction
from azure.core.credentials import AzureKeyCredential

# environment variables must be named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
key = os.environ.get('LANGUAGE_KEY')
endpoint = os.environ.get('LANGUAGE_ENDPOINT')


# Authenticate the client using key and endpoint 
def authenticate_client():
    ta_credential = AzureKeyCredential(key)
    text_analytics_client = TextAnalyticsClient(
            endpoint=endpoint, 
            credential=ta_credential)
    return text_analytics_client

client = authenticate_client()

# Example method for summarizing text
def summarize(client, document): 
    # summarization takes list of documents(documents can be strings)
    poller = client.begin_abstract_summary(document)
    abstract_summary_results = poller.result()
    summary = ""
    for result in abstract_summary_results:
        if result.kind == "AbstractiveSummarization":
            # print("Summaries abstracted:")
            # [print(f"{summary.text}\n") for summary in result.summaries]
            for line in result.summaries:
                summary += line.text
        elif result.is_error is True:
            print("...Is an error with code '{}' and message '{}'".format(
                result.error.code, result.error.message
            ))
    
    return summary