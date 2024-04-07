"""Web Scraping - Playwright"""

import re
import tldextract
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
from pathlib import Path


# function to return website title, text and save screenshot
def get_website_data(url):
    with sync_playwright() as p:
        browser = p.chromium.launch({"chromiumSandbox": False})
        page = browser.new_page()
        page.goto(url)
        title = page.title()
        content = page.content()

        # using the subdomain+domain as image name
        ext = tldextract.extract(url)
        imgName = ext.subdomain + ext.domain

        screenshot_path = (
            Path(__file__).parent.parent.parent / f"frontend/public/{imgName}.png"
        )
        page.screenshot(path=screenshot_path)
        browser.close()

    # use beautiful soup to parse html content
    soup = BeautifulSoup(content, features="html.parser")
    # removing footer of website
    s = soup.find("footer")
    if s:
        s.extract()
    url_text = soup.get_text()

    # cleaning text
    # stripping out the newline indicator
    clean_text = url_text.replace("\n", " ")
    # removing extra spaces
    clean_text = " ".join(clean_text.split())
    # remove non_ascii characters with regex
    clean_text = re.sub(r"[^\x00-\x7F]", " ", clean_text)

    # summarize takes a list and limit the document to 4000char (brute force)
    clean_text = [clean_text[:4000]]

    return (title, clean_text, screenshot_path)
