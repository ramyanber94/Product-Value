from contextlib import asynccontextmanager
from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from model.services.ai_websearch import search_and_answer
from model.services.vehicleDecoder import extract_page_source_from_url as extract_page_source_from_url_vehiclereport
from model.utils.browser import ChromeDriverManager
import asyncio


class UrlRequest(BaseModel):
    question: str


class ExtractInfoUrlRequest(BaseModel):
    url: str
    vin: str


class MarketValRequest(BaseModel):
    make: str
    model: str
    year: str
    trim: str


port = 8000
task_queue: asyncio.Queue = asyncio.Queue()
browser_driver = None  # Will hold the singleton browser instance


@asynccontextmanager
async def lifespan(app: FastAPI):
    global browser_driver
    # Initialize the Chrome browser once
    browser_driver = ChromeDriverManager.open_browser()
    print("🚀 ChromeDriver initialized at startup.")

    # Start queue worker
    asyncio.create_task(queue_worker())

    yield


async def queue_worker():
    while True:
        task_fn = await task_queue.get()
        try:
            await task_fn()
        except Exception as e:
            print(f"Task error: {e}")
        task_queue.task_done()


app = FastAPI(
    title="VIN, Model, and Engine Extractor API",
    description="Extract VIN, model, and engine from raw page text using a transformer model.",
    port=port,
    lifespan=lifespan
)

api_router = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@api_router.get("/")
async def root():
    """Check API status"""
    return {"message": "VIN, Model, and Engine Extractor API is running."}


@api_router.post("/extract_info")
async def extract_info(request: ExtractInfoUrlRequest):
    """Extract VIN, model, and engine info using queued browser access."""
    global browser_driver
    chrome_utils = ChromeDriverManager()
    try:
        # Check if the browser is alive
        is_alive = chrome_utils.is_browser_alive(browser_driver)
    except Exception as e:

        print(f"Error checking browser status: {e}")
        is_alive = False
    if (is_alive is False):
        ChromeDriverManager._driver = None
        browser_driver = ChromeDriverManager.open_browser()

    future: asyncio.Future = asyncio.get_event_loop().create_future()

    async def task():
        try:
            data = extract_page_source_from_url_vehiclereport(
                request.vin, driver=browser_driver)
            future.set_result(data)
        except Exception as e:
            future.set_exception(e)

    await task_queue.put(task)

    try:
        result = await future
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/market_value_ai")
async def websearch_ai(request: UrlRequest):
    """Extract VIN, model, and engine info using queued browser access."""
    global browser_driver
    chrome_utils = ChromeDriverManager()
    try:
        # Check if the browser is alive
        is_alive = chrome_utils.is_browser_alive(browser_driver)
    except Exception as e:

        print(f"Error checking browser status: {e}")
        is_alive = False
    if (is_alive is False):
        ChromeDriverManager._driver = None
        browser_driver = ChromeDriverManager.open_browser()

    future: asyncio.Future = asyncio.get_event_loop().create_future()

    async def task():
        try:
            data = search_and_answer(
                request.question, browser_driver)
            future.set_result(data)
        except Exception as e:
            future.set_exception(e)

    await task_queue.put(task)

    try:
        result = await future
        if not result:
            raise HTTPException(status_code=404, detail="No data found.")
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


app.include_router(api_router)
