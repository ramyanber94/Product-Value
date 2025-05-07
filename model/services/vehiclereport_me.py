import os
import time
from bs4 import BeautifulSoup
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from model.services.contactCarsVals import getMarketValFromContactCars
from model.utils.browser import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def extract_page_source_from_url(vin: str, driver: ChromeDriverManager):
    """Extract page source from the given URL using undetected_chromedriver"""

    # url = .env("VEHICLE_DECODER_URL")
    try:
        url = os.getenv("VEHICLE_DECODER_URL")        

        driver.get(url)
        # input_field = driver.find_element(By.XPATH, "//input[@id='vin1']")

        input_field = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@id='vin1']"))  # update selector as needed
        )
        
        # insert the VIN number into the input field OLD Way
        # input_field.click()
        # input_field.send_keys(vin)
        # input_field.send_keys(Keys.RETURN)

        # insert the VIN number into the input field New Way
        driver.execute_script("document.getElementById('vin1').value = arguments[0];", vin)
        driver.execute_script("document.getElementById('vin1').form.submit();")
       
        # wait till make ul is loaded OLD Way

        # makeTeaser = driver.find_element(By.XPATH, "//ul[@id='teaser_make']")
        # while not makeTeaser.is_displayed():
        #     time.sleep(0.5)
       
       # wait till make ul is loaded New Way
        makeTeaser = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, "//ul[@id='teaser_make']"))
                       )    
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        makeUl = soup.find("ul", id="teaser_make")
        if makeUl is not None:
            make = makeUl.find("li").text.strip()
        else:
            make = None
        yearUl = soup.find("ul", id="teaser_year")
        if yearUl is not None:
            year = yearUl.find("li").text.strip()
        else:
            year = None
        modelUl = soup.find("ul", id="teaser_model")
        if modelUl is not None:
            model = modelUl.find("li").text.strip()
        else:
            model = None

        trimUl = soup.find("ul", id="teaser_spec")
        if trimUl is not None:
            trim = trimUl.find("li").text.strip()
        else:
            trim = None

        tableUl = soup.find("div", class_="table-responsive")
        # check the first td in each tr if it is input radio checked so this is the row which we want to extract the engine from
        trs = []
        try:
            trs = tableUl.find_all("tr")
        except:
            trs = []
        print(make, year, model, trim)

        engine = None
        transmission = None
        seats = None
        doors = None
        body = None
        fuel = None
        hp = None
        driveTrain = None
        if len(trs) > 0:
            for tr in trs:
                tds = tr.find_all("td")
                if len(tds) > 0:
                    if tds[0].find("input", {"type": "radio", "checked": ""}) is not None:
                        engine = tds[4].text.strip()
                        transmission = tds[5].text.strip()
                        seats = tds[3].text.strip()
                        doors = tds[2].text.strip()
                        body = tds[1].text.strip()
                        fuel = tds[6].text.strip()
                        hp = tds[7].text.strip()
                        driveTrain = tds[8].text.strip()
                        break
        driver.delete_all_cookies()
        driver.get("about:blank")  # clear current page

        marketVals = getMarketValFromContactCars(make,model,year,driver= driver)        
        if marketVals is not None:
            return {"make": make, "year": year, "model": model, 
                    "trim": trim, "engine": engine,
                    "transmission": transmission, 
                    "seats": seats, "doors": doors, 
                    "body": body, 
                    "fuel": fuel, "hp": hp,
                    "driveTrain": driveTrain,
                    "min": marketVals["min"], 
                    "average": marketVals["average"], 
                    "max": marketVals["max"] 
                    }
        else:
            return {"make": make, "year": year, "model": model, 
                    "trim": trim, "engine": engine,
                    "transmission": transmission, 
                    "seats": seats, "doors": doors, 
                    "body": body, 
                    "fuel": fuel, "hp": hp,
                    "driveTrain": driveTrain,
                    "min": "NA", 
                    "average":"NA", 
                    "max": "NA" 
                    }
    
    except Exception as e:
        print(f"Error extracting page source: {e}")
        driver.delete_all_cookies()
        driver.get("about:blank")  # clear current page
        return None
