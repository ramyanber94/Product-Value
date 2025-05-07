import os
import time
from bs4 import BeautifulSoup
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from model.utils.browser import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def getMarketValFromContactCars(make: str, model:str , year:str , driver: ChromeDriverManager):
    """Extract page source from the given URL using undetected_chromedriver"""

    try:
        url = os.getenv("CONTACT_CARS_URL")
        url = url.replace("makeVal", make.replace(' ','_').lower()).replace("modelVal", model.replace(' ','_').lower()).replace("yearVal", year)           
        driver.get(url)

        li_element = WebDriverWait(driver, 35).until(
                    EC.element_to_be_clickable((By.XPATH, "//h2[text()='Info']/ancestor::li")))
        
        driver.execute_script("arguments[0].click();", li_element)

        # wait till make table is loaded
        time.sleep(2)

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        # Find the element with id="info"
        info_section = soup.find(id="info")
        table = info_section.find("table")
        tbody = table.find("tbody")
        # Find the first (and only) <tr> in the table
        row = tbody.find("tr")
        # Get all <td> elements in that row
        tds = row.find_all("td")
        # Loop through each <td> and assign to variables
        carDet, average, min, max = [td.get_text(strip=True) for td in tds]        

        driver.delete_all_cookies()
        driver.get("about:blank")  # clear current page
        return {"min": min, "average": average, "max":max}
    except Exception as e:
        print(f"Error extracting page source: {e}")
        driver.delete_all_cookies()
        driver.get("about:blank")  # clear current page
        return None
