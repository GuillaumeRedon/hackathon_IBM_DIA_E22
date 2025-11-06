from app.tools.IBMWatsonxChat import IBMWatsonxChat
import os
from app.process import main
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

if __name__ == "__main__":
    api_key = os.getenv("WATSON_API_KEY", None)
    project_id = os.getenv("PROJECT_ID", None)
    url = os.getenv("IBM_URL", None)
    model_id = "meta-llama/llama-3-3-70b-instruct"

    main(
        api_key=api_key,
        project_id=project_id,
        url=url,
        model_id=model_id,
        model_builder=IBMWatsonxChat,
    )
