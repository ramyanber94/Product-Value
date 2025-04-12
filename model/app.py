
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from model.services.vindecoderz import extract_page_source_from_url
from model.services.vehiclereport_me import extract_page_source_from_url as extract_page_source_from_url_vehiclereport
from fastapi.middleware.cors import CORSMiddleware


class UrlRequest(BaseModel):
    url: str
    vin: str


port = 5000

# run on port 8000
app = FastAPI(title="VIN, Model, and Engine Extractor API",
              description="Extract VIN, model, and engine from raw page text using a transformer model.",
              port=port,
              )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def validate_request(request: Request, call_next):
    content_type = request.headers.get('Content-Type', '')

    # Skip content type validation for GET requests
    if request.method == 'GET':
        return await call_next(request)

    # Allow common content types
    if not content_type or (
        'application/json' not in content_type and
        'multipart/form-data' not in content_type and
        'application/x-www-form-urlencoded' not in content_type
    ):
        return await call_next(request)  # Or raise HTTPException if you prefer

    try:
        return await call_next(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/")
async def root():
    """Root endpoint to check if the API is running"""
    return {"message": "VIN, Model, and Engine Extractor API is running."}


@app.post("/extract_info/")
async def extract_info(request: UrlRequest):
    """FastAPI endpoint to extract VIN, model, and engine from the raw page text"""

    url = request.url
    vin = request.vin
    if 'vindecoderz.com' in url:
        extracted_info = extract_page_source_from_url(url)
    elif 'vehiclereport.me' in url:
        extracted_info = extract_page_source_from_url_vehiclereport(
            url, vin)
    # Step 1: Use the model to extract VIN, model, and engine from the input text

    # Step 2: Return the extracted information
    return {"success": True, "data": extracted_info}
