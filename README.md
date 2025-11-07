# Welcome to the IBM Hackathon! 🎉

This repository serves as a template to help you get started quickly.  
Follow the project structure, fork the repo, and clone it locally to begin.

---

## Fork the Repository

1. Click **Fork** (top right) to create a copy under your own account
2. Make sure the fork is **public**  
   If it isn't, go to:  
   **Settings → Change repository visibility → Public**

---

## Clone the Repository

Once you have forked the repository:

```bash
# Clone your fork (replace <your-user> and <repo> with your info)
git clone https://github.com/<your-user>/<repo>.git

# Move into the project folder
cd <repo>
```

---


### Create a new branch for each feature or fix:

```bash
start frontend :

cd .\hackathon_IBM_DIA_E22\source\frontend\help-center
npm run

start backend


```
## Backend — RAG propulsé par IBM watsonx

### Pile technique
- Python 3.10+
- [LangChain](https://python.langchain.com/) pour l’orchestration des prompts/RAG
- [Chroma](https://docs.trychroma.com/) comme base vectorielle persistée en local (`source/database/prod`)
- Modèle d’embeddings `intfloat/multilingual-e5-large` (HuggingFace)
- Modèle génératif `meta-llama/llama-3-3-70b-instruct` servi via IBM watsonx.ai
- Authentification IBM Cloud via `ibm-cloud-sdk-core`

### Architecture rapide
1. `app/tools/document_loader.py` convertit le JSON QA (`source/database/samples/clean-json-file.json`) en `Document` LangChain enrichis de métadonnées (écoles, thématiques, utilisateurs, etc.).
2. `app/tools/rag_system.py` construit ou recharge la base vectorielle Chroma : embeddings HuggingFace sur CPU, persistance automatique, retriever MMR (k=8).
3. `app/tools/IBMWatsonxChat.py` encapsule l’API chat watsonx dans un `BaseChatModel` LangChain (auth IAM + appel REST).
4. `app/process.py` assemble la chaîne RAG : récupération des documents les plus pertinents, prompt métier (assistant du Pôle Léonard de Vinci) et génération de la réponse.
5. `source/backend/main.py` charge les variables d’environnement, instancie le modèle et lance le flux principal (exemple de question en fin de script).

### Configuration
Créer un fichier `.env` à la racine du repo (ou exporter les variables) avec :
```
WATSON_API_KEY=***
PROJECT_ID=***
IBM_URL=https://<endpoint-watsonx>
```
Le modèle utilisé peut être changé dans `main.py` (`model_id`).

### Installation & exécution
```bash
cd source/backend
python -m venv .venv
. .venv/Scripts/activate    # ou source .venv/bin/activate
pip install langchain langchain-community langchain-chroma chromadb \
            langchain-core ibm-cloud-sdk-core python-dotenv requests

python main.py
```
Le premier lancement construit la base vectorielle depuis le JSON source (message “Création de la base vectorielle…”). Les exécutions suivantes réutilisent les embeddings persistés.

### Personnalisation & ajout de contenu
- Mettre à jour `source/database/samples/clean-json-file.json` pour enrichir la base FAQ.
- Utiliser `RAGSystem.add_question(...)` (voir fin de `process.py`) pour insérer dynamiquement une nouvelle entrée dans Chroma.
- Ajuster le prompt métier ou les paramètres de recherche (`search_kwargs`) dans `process.py` si vous ciblez un ton ou un rappel documentaire différent.

### Débogage
- Les logs console décrivent chaque étape (chargement des documents, création de la base, appel watsonx, réponse générée).
- En cas d’erreur d’authentification IBM, vérifier `WATSON_API_KEY`, `PROJECT_ID` et l’URL d’API (utiliser l’endpoint `.../ml/v1/text/chat?version=...` fourni par watsonx.ai).

## Contribute

### Commit your changes:

```bash
git add .
git commit -m "Add: my awesome feature"
git push origin feature/my-awesome-feature
```

---

## Quick Rules

✅ Keep your fork **public** during the hackathon  
✅ Follow the **template's structure**  
❓ For any questions: contact **kryptosphere@devinci.fr**

---

## Have Fun and Good Luck!

Good luck during the IBM Hackathon — build, learn, and most importantly: **have fun!** 🚀



