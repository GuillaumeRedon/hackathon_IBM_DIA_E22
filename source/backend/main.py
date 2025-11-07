from dotenv import load_dotenv
from fastapi import FastAPI
from api.router import api_router

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()


app = FastAPI(title="HelpAI Backend API")

app.include_router(api_router)