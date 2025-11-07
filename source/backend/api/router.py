from fastapi import APIRouter
from api.v1.router import router as v1_router
#from api.v2.router import router as v2_router

api_router = APIRouter()
api_router.include_router(v1_router, prefix="/v1", tags=["v1"])
#api_router.include_router(v2_router, prefix="/v2", tags=["v2"])