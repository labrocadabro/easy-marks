import codecs
import re
import os
import nltk
from bs4 import BeautifulSoup
from unidecode import unidecode
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
# install azure-ai-textanalytics==5.3.0
from azure.ai.textanalytics import TextAnalyticsClient, AbstractiveSummaryAction
from azure.core.credentials import AzureKeyCredential

# obtain version of chromedriver compatible with browser
options = webdriver.ChromeOptions()
options.add_argument("--headless")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()),options=options)

val = "https://quicktraincanada.ca/"
# wait = WebDriverWait(driver,5)
driver.get(val)
# taking screenshot
driver.save_screenshot('website.png')
get_url = driver.current_url
# wait.until(EC.url_to_be(val))
if get_url == val:
    page_source = driver.page_source

# use beautiful soup to parse html content
soup = BeautifulSoup(page_source, features="html.parser")
title = soup.title.text
# removing footer of website
s = soup.find('footer')
if s:
    s.extract()
url_content = soup.get_text()

def cleanText(url_text):
    # stripping out the newline indicator
    clean_text = url_text.replace("\n", " ")
    # removing extra spaces
    clean_text = " ".join(clean_text.split())
    #remove non_ascii characters with regex
    clean_text = re.sub(r'[^\x00-\x7F]', ' ', clean_text)
    return clean_text

# This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
key = os.environ.get('LANGUAGE_KEY')
endpoint = os.environ.get('LANGUAGE_ENDPOINT')


# Authenticate the client using your key and endpoint 
def authenticate_client():
    ta_credential = AzureKeyCredential(key)
    text_analytics_client = TextAnalyticsClient(
            endpoint=endpoint, 
            credential=ta_credential)
    return text_analytics_client

client = authenticate_client()

# Example method for summarizing text
def abstractive_summarization(client, document):

    poller = client.begin_abstract_summary(document)
    abstract_summary_results = poller.result()
    for result in abstract_summary_results:
        if result.kind == "AbstractiveSummarization":
            print("Summaries abstracted:")
            [print(f"{summary.text}\n") for summary in result.summaries]
        elif result.is_error is True:
            print("...Is an error with code '{}' and message '{}'".format(
                result.error.code, result.error.message
            ))

website_text = cleanText(url_content)
document = [website_text] # summarization takes list of documents(documents can be strings)
# print(website_text)
# print("Length of document is ", len(website_text))
abstractive_summarization(client, document)