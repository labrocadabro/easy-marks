"""Web scraping module for extracting text from website using Playwright."""

import os
import re
from pathlib import Path
from playwright.sync_api import sync_playwright
import tldextract
from bs4 import BeautifulSoup
import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv


# Load environment variables
load_dotenv()

# Configure Cloudinary
config = cloudinary.config(
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)


# Custom exception for Playwright
class PlaywrightException(Exception):
    def __init__(self, message):
        super().__init__(message)


# Function to return website title, text and save screenshot
def get_website_data(url):
    try:
        with sync_playwright() as p:
            # In order to get Heroku deployment to work ,the path to chromium has to be set in an env variable
            # we can probably test is we're on localhost and switch this automatically but I'm tired of this right now
            # browser = p.chromium.launch()
            ipad_pro = p.devices["iPad Pro 11 landscape"]
            browser = p.chromium.launch(
                executable_path=os.getenv("CHROMIUM_EXECUTABLE_PATH")
            )
            context = browser.new_context(**ipad_pro)
            page = context.new_page()
            page.goto(url)
            page
            title = page.title()
            # while title == "Just a moment...":
            #     time.sleep(5)
            #     title = page.title()

            content = page.content()

            # using the subdomain+domain as image name
            ext = tldextract.extract(url)
            imgName = ext.subdomain + ext.domain

            screenshot_path = (
                Path(__file__).parent.parent.parent / f"frontend/public/{imgName}.png"
            )
            page.screenshot(path=screenshot_path)
            result = cloudinary.uploader.upload(
                screenshot_path, unique_filename=True, overwrite=False
            )

            os.remove(screenshot_path)

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

        return (title, clean_text, result["secure_url"])
    except:
        raise PlaywrightException("Playwright failed to process page")
