from bs4 import BeautifulSoup
import os
from langchain_community.chat_models import ChatOpenAI
from langchain.schema import HumanMessage
from serpapi import GoogleSearch
from dotenv import load_dotenv

load_dotenv()  # loads from .env automatically


llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)


# This function uses DuckDuckGo to search for the question and returns the top URLs.
def search_web(query):
    params = {
        "q": query,
        "hl": "en",  # Language
        "api_key": os.getenv("SERPAPI_API_KEY"),  # Your SerpAPI key
        "engine": "google",  # Search engine,
        # country code
        "gl": "eg",  # Egypt
    }
    search = GoogleSearch(params)
    results = search.get_dict()

    # Extract URLs from organic results
    urls = []
    if "organic_results" in results:
        for result in results["organic_results"]:  # Limit to top 5 results
            # if youtube or facebook, skip
            if "youtube.com" in result["link"] or "facebook.com" in result["link"]:
                continue
            if "link" in result:
                urls.append(result["link"])
    return urls


# This function uses Selenium to extract text from the given URL.
def extract_text_from_url(url, browser_driver):
    try:
        browser_driver.set_page_load_timeout(10)
        browser_driver.get(url)
        browser_driver.implicitly_wait(10)  # seconds
        page_source = browser_driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')
        body = soup.find('body')
        if body is None:
            return ""
        return body.get_text()
    except:
        return ""


def extract_prices_llm(text):
    prompt = f"""
You are an expert at extracting price data from messy text.

From the text below, extract the **minimum**, **maximum**, and **average** prices in **EGP**. 
Ignore any numbers that are clearly **not prices** (like years, IDs, area sizes, phone numbers).
Also **ignore outliers** that are **unrealistically low (e.g., < EGP 1000)** or **too high (e.g., > EGP 10,000,000)**.

If you find no valid prices, return: None

Return format (numbers only, no commas or units):
Minimum: <value>
Maximum: <value>
Average: <value>

Text:
{text}
"""
    response = llm([HumanMessage(content=prompt)])
    content = response.content.strip()

    if "None" in content.lower():
        return None

    import re
    try:
        min_match = re.search(r"Minimum:\s*(\d{4,8})", content)
        max_match = re.search(r"Maximum:\s*(\d{4,8})", content)
        avg_match = re.search(r"Average:\s*(\d{4,8})", content)

        if not (min_match and max_match and avg_match):
            return None

        return {
            "min": int(min_match.group(1)),
            "max": int(max_match.group(1)),
            "average": int(avg_match.group(1))
        }
    except Exception:
        return None


def get_answer(text):
    prices = extract_prices_llm(text)
    if prices:
        return prices
    else:
        return "No prices found."


def clean_body_context(text):
    # Remove unwanted characters and clean the text
    text = text.replace("\n", " ").replace("\r", " ")
    text = ' '.join(text.split())
    return text


def search_and_answer(question, browser_driver):
    urls = search_web(question)
    contexts = [extract_text_from_url(url, browser_driver) for url in urls]

    for context in contexts:
        if len(context) > 1000:  # Ensure some content
            cleaned_context = clean_body_context(context)
            answer = get_answer(cleaned_context)
            if answer:
                print("Answer:", answer)
                break

    return answer
