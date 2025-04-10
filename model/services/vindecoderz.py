import undetected_chromedriver as uc
import time
from bs4 import BeautifulSoup
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import re


def extract_page_source_from_url(url):
    """Extract page source from the given URL using undetected_chromedriver"""

    driver = uc.Chrome()
    # headless = True
    driver.get(url)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    body = None
    time.sleep(10)
    while True:
        body = soup.find("body").text
        if "review the security of your connection" not in body:
            break
        print("Cloudflare iframe detected, waiting for it to disappear...")
        time.sleep(5)
        ActionChains(driver).send_keys(Keys.TAB).perform()
        time.sleep(2)
        ActionChains(driver).send_keys(Keys.SPACE).perform()
        time.sleep(10)
        soup = BeautifulSoup(driver.page_source, 'html.parser')

    # Close the driver
    driver.quit()

    extracted_info = manual_extraction(body)

    return extracted_info


def manual_extraction(text: str) -> dict:
    """
    Extract vehicle information from HTML text using regex patterns.
    Returns a dictionary with make, model, year, trim, and engine.
    Missing fields will be None.
    """

    result = {
        'make': None,
        'model': None,
        'year': None,
        'trim': None,
        'engine': None
    }

    # Make (Brand)
    make_match = re.search(r'Brand:\s*\n\s*([^\n]+)', text)
    if make_match:
        result['make'] = make_match.group(1).strip()

    # Model
    model_match = re.search(r'Model:\s*\n\s*([^\n]+)', text)
    if model_match:
        result['model'] = model_match.group(1).strip()

    year_match = re.search(r'Year:\s*\n\s*([^\n]+', text)
    if year_match:
        result['year'] = year_match.group(1).strip()

    # Trim (from Build Sheet)
    trim_match = re.search(r'Trim:\s*\n\s*([^\n]+', text)
    if trim_match:
        result['trim'] = trim_match.group(1).split(
        )[0].strip()  # Take first part before space

    # Engine (from Build Sheet)
    engine_match = re.search(r'Engine:\s*\n\s*([^\n]+)', text)
    if engine_match:
        result['engine'] = engine_match.group(1).strip()

    return result
