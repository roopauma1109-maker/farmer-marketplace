from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from .database import engine, Base
from .seed_data import seed_database
from .routers import auth, crops, farmers, buyers, enquiries, market_prices, ai

# Initialize tables & seed data on startup
try:
    Base.metadata.create_all(bind=engine)
    seed_database()
except Exception as e:
    print(f"Warning during DB initialization / seeding: {e}")

app = FastAPI(
    title="AgriDirect API",
    description="Direct Farmer-to-Buyer Marketplace REST API (SIH26033)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for Vite frontend and local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clean Global Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": exc.detail or "An error occurred."}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err["loc"] if loc != "body")
        errors.append(f"{field}: {err['msg']}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"success": False, "error": "; ".join(errors) or "Invalid input data."}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled server error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "error": "Internal server error. Please try again later."}
    )

# Include Routers
app.include_router(auth.router)
app.include_router(crops.router)
app.include_router(farmers.router)
app.include_router(buyers.router)
app.include_router(enquiries.router)
app.include_router(market_prices.router)
app.include_router(ai.router)

@app.get("/", tags=["Health"])
def root():
    return {
        "app": "AgriDirect — Direct Farmer-to-Buyer Marketplace",
        "version": "1.0.0",
        "status": "online",
        "problem_statement": "SIH26033",
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
