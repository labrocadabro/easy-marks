# receive url, send back text and screenshot URL
# can probably save files locally on the server, or can upload to a cloud service

import re
import nltk
from bs4 import BeautifulSoup
from unidecode import unidecode
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# function to return website title, text and save screenshot
def get_website_data(url):
    # obtain version of chromedriver compatible with browser
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()),options=options)
    driver.get(url)
    # taking screenshot
    url_domain = ""
    driver.save_screenshot('https://website.ca.png')
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

    return (title,clean_text)

############ This is for testing purposes ##################
if __name__ == '__main__':
    title, urlText = get_website_data('https://quicktraincanada.ca/')
    print (f"The title of the website is {title}.")
    print(f"The website text is: \n", urlText)