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

# function to return website text and screenshot
def getWebsiteData(url):
    # obtain version of chromedriver compatible with browser
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()),options=options)

    driver.get(url)
    # taking screenshot
    driver.save_screenshot(f'{url}.png')
    get_url = driver.current_url
    # wait.until(EC.url_to_be(val))
    if get_url == url:
        page_source = driver.page_source

    # use beautiful soup to parse html content
    soup = BeautifulSoup(page_source, features="html.parser")
    title = soup.title.text
    # removing footer of website
    s = soup.find('footer')
    if s:
        s.extract()
    url_text = soup.get_text()

    # cleaning text
    # stripping out the newline indicator
    clean_text = url_text.replace("\n", " ")
    # removing extra spaces
    clean_text = " ".join(clean_text.split())
    #remove non_ascii characters with regex
    clean_text = re.sub(r'[^\x00-\x7F]', ' ', clean_text)

    return clean_text

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
def abstractive_summarization(client, document): 
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