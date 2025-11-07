# Backend - RAG System Documentation

## 📋 Overview

The backend is a sophisticated RAG (Retrieval-Augmented Generation) system built with FastAPI, Python, LangChain, and IBM watsonx.ai. It provides intelligent question-answering capabilities for the Pôle Léonard de Vinci Help Center by combining semantic search with generative AI through RESTful API endpoints.

## 🏗️ Architecture

### Core Components

```
source/backend/
├── main.py                         # FastAPI Application Entry Point
├── requirements.txt                # Python Dependencies
├── api/
│   ├── router.py                   # Main API Router
│   └── v1/
│       ├── router.py               # Version 1 API Router
│       └── endpoints/
│           ├── ask.py              # Chat/Question Endpoint
│           └── add_question.py     # Add New Q&A Endpoint
├── schemas/
│   ├── message.py                  # Message/Chat Schemas
│   └── question.py                 # Question Addition Schema
└── tools/
    ├── document_loader.py          # JSON to LangChain Documents
    ├── rag_system.py               # Vector DB & Retrieval
    └── IBMWatsonxChat.py           # watsonx.ai Integration
```

### API Endpoints

| Endpoint | Method | Purpose | Request Format |
|----------|--------|---------|----------------|
| `/v1/ask/` | POST | Ask questions to AI | `{"messages": [{"id": "datetime", "role": "user|agent", "content": "string"}]}` |
| `/v1/add_question/` | POST | Add new Q&A to knowledge base | `{"titre": "string", "contenu": "string", "ecoles": "enum", ...}` |

### Data Flow

```
HTTP Request (JSON)
     ↓
FastAPI Endpoint (/v1/ask/ or /v1/add_question/)
     ↓
Pydantic Schema Validation
     ↓
RAG System (Chroma Vector DB + HuggingFace Embeddings)
     ↓
Retrieval (MMR Algorithm, k=8)
     ↓
Prompt Construction (Context + Question + Conversation History)
     ↓
IBM watsonx.ai (Llama 3.3 70B)
     ↓
JSON Response
```

## 🔧 Technical Stack

### Core Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| **Python** | 3.10+ | Runtime environment |
| **FastAPI** | ≥0.104.1 | Modern web framework for building APIs |
| **Uvicorn** | Latest | ASGI server for FastAPI |
| **LangChain** | Latest | RAG orchestration framework |
| **langchain-community** | Latest | Community integrations |
| **langchain-chroma** | Latest | Chroma vector store integration |
| **chromadb** | Latest | Vector database |
| **langchain-core** | Latest | Core LangChain abstractions |
| **ibm-cloud-sdk-core** | Latest | IBM Cloud authentication |
| **python-dotenv** | Latest | Environment variable management |
| **requests** | Latest | HTTP client for API calls |
| **pydantic** | ≥2.9.0 | Data validation and serialization |

### AI Models

- **Embeddings**: `intfloat/multilingual-e5-large` (HuggingFace)
  - Multilingual support (including French)
  - High-quality semantic representations
  - CPU-compatible
  
- **Generation**: `meta-llama/llama-3-3-70b-instruct` (IBM watsonx.ai)
  - 70 billion parameters
  - Instruction-tuned for conversations
  - Hosted on IBM Cloud

## 📦 Installation

### 1. Prerequisites

```bash
# Verify Python version
python --version  # Should be 3.10 or higher
```

### 2. Virtual Environment Setup

```bash
# Navigate to backend directory
cd source/backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate

# On macOS/Linux:
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt

# Or install manually:
pip install fastapi \
            uvicorn[standard] \
            langchain \
            langchain-community \
            langchain-chroma \
            chromadb \
            langchain-core \
            ibm-cloud-sdk-core \
            python-dotenv \
            requests \
            pydantic
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:

```env
# IBM watsonx.ai Credentials
WATSON_API_KEY=your_api_key_here
PROJECT_ID=your_project_id_here
IBM_URL=https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29

# Optional: Logging Configuration
LOG_LEVEL=INFO
```

**Getting IBM Credentials:**

1. Log in to [IBM Cloud](https://cloud.ibm.com/)
2. Navigate to your watsonx.ai instance
3. Go to **Service credentials** → **New credential**
4. Copy your API key
5. Find your Project ID in the watsonx.ai project settings
6. Use the appropriate regional endpoint for `IBM_URL`

## 🚀 Usage

### Starting the FastAPI Server

```bash
# Ensure you're in the backend directory with activated venv
cd source/backend

# Start the development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or for production
uvicorn main:app --host 0.0.0.0 --port 8000
```

### API Documentation

Once the server is running, you can access:

- **Interactive API docs**: http://localhost:8000/docs (Swagger UI)
- **Alternative docs**: http://localhost:8000/redoc (ReDoc)
- **OpenAPI schema**: http://localhost:8000/openapi.json

### API Endpoints Usage

#### 1. Ask Questions (`POST /v1/ask/`)

Send chat messages and receive AI responses with conversation context.

**Request Format:**
```json
{
  "messages": [
    {
      "id": "2025-11-07T13:55:00Z",
      "role": "user",
      "content": "Bonjour, je voudrais des informations sur les absences"
    },
    {
      "id": "2025-11-07T13:55:05Z", 
      "role": "agent",
      "content": "Bonjour ! Je peux vous renseigner sur les règles d'absences. Que souhaitez-vous savoir ?"
    },
    {
      "id": "2025-11-07T13:56:00Z",
      "role": "user", 
      "content": "Est-ce qu'un rendez-vous médical excuse une absence ?"
    }
  ]
}
```

**Response Format:**
```json
{
  "status": "200",
  "response": "Oui, un rendez-vous médical peut excuser une absence. Vous devez fournir un justificatif médical..."
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/v1/ask/" \
     -H "Content-Type: application/json" \
     -d '{
       "messages": [
         {
           "id": "2025-11-07T13:56:00Z",
           "role": "user",
           "content": "Comment justifier une absence ?"
         }
       ]
     }'
```

#### 2. Add Questions (`POST /v1/add_question/`)

Add new Q&A pairs to the knowledge base.

**Request Format:**
```json
{
  "titre": "Horaires cafétéria dimanche",
  "contenu": "Question: Quelles sont les heures d'ouverture de la cafétéria du campus le dimanche matin?\n\nRéponse: La cafétéria du campus est ouverte le dimanche de 9h00 à 14h00...",
  "thematique": "Services campus",
  "ecoles": "ESILV",
  "utilisateurs": "student", 
  "langue": "Français"
}
```

**Response Format:**
```json
{
  "status": "200",
  "message": "Question added successfully"
}
```

**Schema Validation:**
- `titre`: string (required) - Short title for the Q&A
- `contenu`: string (required) - Full question and answer content
- `thematique`: string (optional) - Topic/category
- `ecoles`: enum (required) - One of: "IIM", "EXECUTIVE", "EMLV", "ESILV"
- `utilisateurs`: enum (required) - One of: "faculty-en", "anonymous", "staff", "student", "staff-en", "student-en", "faculty"
- `langue`: enum (required) - One of: "Français", "English"

## 📝 Component Documentation

### 1. FastAPI Application (`main.py`)

**Purpose**: Entry point for the web API server with CORS configuration.

**Key Features:**
- FastAPI application setup
- CORS middleware for frontend integration
- API router inclusion
- Environment configuration loading

**CORS Configuration:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. API Routers (`api/`)

**Structure:**
- `api/router.py`: Main API router
- `api/v1/router.py`: Version 1 API endpoints
- `api/v1/endpoints/`: Individual endpoint implementations

**Versioning Strategy:**
- `/v1/` prefix for version 1 endpoints
- Future versions can be added as `/v2/`, etc.
- Backwards compatibility maintained

### 3. Schemas (`schemas/`)

**Message Schema (`message.py`):**
```python
class MessageSchema(BaseModel):
    id: datetime              # Message timestamp
    role: Literal["user", "agent"]  # Message sender
    content: str             # Message content

class MessageList(BaseModel):
    messages: list[MessageSchema]  # Conversation history
```

**Question Schema (`question.py`):**
```python
class QuestionSchema(BaseModel):
    titre: str                                    # Q&A title
    contenu: str                                 # Full content
    thematique: Optional[str] = ""               # Topic category
    ecoles: Literal['IIM', 'EXECUTIVE', 'EMLV', 'ESILV']  # School
    utilisateurs: Literal[...]                   # User type
    langue: Literal["Français", "English"]      # Language
```

### 4. Document Loader (`document_loader.py`)

**Purpose**: Converts JSON FAQ entries into LangChain Document objects with rich metadata.

**Key Features:**
- Parses `clean-json-file.json`
- Enriches documents with metadata:
  - School (ESILV, EMLV, IIM)
  - Topic/Theme
  - User type (student, teacher, admin)
  - Language
  - Custom attributes

**Usage:**
```python
from app.tools.document_loader import DocumentLoader

loader = DocumentLoader("path/to/clean-json-file.json")
documents = loader.load()

# Each document has:
# - page_content: The question-answer pair
# - metadata: {school, topic, user_type, ...}
```

**Data Format:**
```json
{
  "question": "Comment justifier une absence ?",
  "answer": "Pour justifier une absence, vous devez...",
  "metadata": {
    "school": "ESILV",
    "topic": "Scolarité",
    "user_type": "student",
    "language": "fr"
  }
}
```

### 5. RAG System (`rag_system.py`)

**Purpose**: Manages the Chroma vector database and retrieval operations.

**Key Features:**
- **Vector Store Management**: Creates and persists Chroma database
- **Embedding Generation**: Uses HuggingFace's multilingual-e5-large
- **Smart Retrieval**: MMR (Maximal Marginal Relevance) algorithm
- **Persistence**: Automatic save/load from disk

**Configuration:**
```python
from app.tools.rag_system import RAGSystem

rag = RAGSystem(
    persist_directory="source/database/prod",
    embedding_model="intfloat/multilingual-e5-large"
)

# Create or load vector store
rag.create_or_load_vectorstore(documents)

# Get retriever with MMR
retriever = rag.get_retriever(
    search_type="mmr",
    k=8,              # Number of documents to retrieve
    fetch_k=20        # Number of documents to fetch before MMR
)
```

**Retrieval Strategies:**

| Strategy | Description | Use Case |
|----------|-------------|----------|
| **Similarity** | Pure cosine similarity | Fast, direct matches |
| **MMR** | Balances relevance & diversity | Better coverage, less redundancy |
| **Similarity Score Threshold** | Filters by similarity score | High-precision retrieval |

**Dynamic Updates:**
```python
# Add new Q&A pairs without rebuilding
rag.add_question(
    question="Nouvelle question ?",
    answer="Réponse détaillée...",
    metadata={"school": "EMLV", "topic": "Admissions"}
)
```

### 6. IBM Watsonx Chat (`IBMWatsonxChat.py`)

**Purpose**: Custom LangChain integration for IBM watsonx.ai API.

**Key Features:**
- Extends `BaseChatModel` from LangChain
- Handles IAM authentication
- Manages REST API calls
- Converts between LangChain and watsonx formats

**Architecture:**
```python
from app.tools.IBMWatsonxChat import IBMWatsonxChat

llm = IBMWatsonxChat(
    api_key="your_api_key",
    project_id="your_project_id",
    model_id="meta-llama/llama-3-3-70b-instruct",
    url="https://us-south.ml.cloud.ibm.com/ml/v1/text/chat",
    temperature=0.7,
    max_tokens=1000,
    top_p=0.9
)
```

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `temperature` | 0.7 | Randomness (0=deterministic, 1=creative) |
| `max_tokens` | 1000 | Maximum response length |
| `top_p` | 0.9 | Nucleus sampling threshold |
| `top_k` | 50 | Top-k sampling |
| `repetition_penalty` | 1.0 | Penalty for repetition |

**Authentication Flow:**
```
1. Load credentials from .env
2. Request IAM token from IBM Cloud
3. Cache token (valid for 1 hour)
4. Include token in API requests
5. Auto-refresh when expired
```

### 7. API Endpoints (`api/v1/endpoints/`)

**Ask Endpoint (`ask.py`):**

**Purpose**: Processes chat conversations and returns AI-generated responses.

**Key Features:**
- Conversation history processing
- RAG-based context retrieval
- Prompt engineering with conversation context
- IBM watsonx.ai integration

**Processing Pipeline:**
```python
@router.post("/", summary="Ask something to the AI")
async def ask(messages: MessageList):
    # 1. Extract last user question
    # 2. Format conversation history
    # 3. Retrieve relevant documents from vector DB
    # 4. Construct prompt with context + conversation
    # 5. Call IBM watsonx.ai
    # 6. Return formatted response
```

**Add Question Endpoint (`add_question.py`):**

**Purpose**: Adds new Q&A pairs to the vector database.

**Key Features:**
- Schema validation via Pydantic
- Dynamic vector database updates
- Metadata enrichment
- Persistent storage

**Processing Pipeline:**
```python
@router.post("/", summary="Add a new question")
async def add_question(question: QuestionSchema):
    # 1. Validate input schema
    # 2. Initialize RAG system
    # 3. Add question to vector database
    # 4. Persist changes
    # 5. Return success status
```

## 🔄 Advanced Features

### Frontend Integration

The backend is designed to work seamlessly with the Next.js frontend:

**CORS Configuration:**
- Allows requests from `localhost:3000` (Next.js dev server)
- Supports all HTTP methods and headers
- Enables credentials for authentication

**Error Handling:**
- Standardized error responses
- HTTP status codes (200, 422, 500)
- Detailed error messages for debugging

### Custom Retrieval Filters

```python
# Filter by school
retriever = rag.get_retriever(
    search_kwargs={
        "k": 8,
        "filter": {"school": "ESILV"}
    }
)

# Filter by multiple criteria
retriever = rag.get_retriever(
    search_kwargs={
        "k": 8,
        "filter": {
            "school": "ESILV",
            "topic": "Scolarité",
            "user_type": "student"
        }
    }
)
```

### Conversation Memory

```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    return_messages=True,
    output_key="answer"
)

# Use in chain
chain = processor.create_chain(memory=memory)
```

### Streaming Responses

```python
# Stream tokens as they're generated
for chunk in llm.stream("Your question here"):
    print(chunk.content, end="", flush=True)
```

### Batch Processing

```python
questions = [
    "Question 1?",
    "Question 2?",
    "Question 3?"
]

responses = processor.batch_process(questions)
```

## 🧪 Testing

### API Testing with cURL

**Test the Ask endpoint:**
```bash
curl -X POST "http://localhost:8000/v1/ask/" \
     -H "Content-Type: application/json" \
     -d '{
       "messages": [
         {
           "id": "2025-11-07T13:56:00Z",
           "role": "user",
           "content": "Comment justifier une absence ?"
         }
       ]
     }'
```

**Test the Add Question endpoint:**
```bash
curl -X POST "http://localhost:8000/v1/add_question/" \
     -H "Content-Type: application/json" \
     -d '{
       "titre": "Test Question",
       "contenu": "Question: Test?\n\nRéponse: Test response.",
       "ecoles": "ESILV",
       "utilisateurs": "student",
       "langue": "Français"
     }'
```

### Interactive Testing

Use the built-in Swagger UI at `http://localhost:8000/docs` for interactive API testing:

1. Navigate to the docs page
2. Click on an endpoint to expand it
3. Click "Try it out"
4. Fill in the request body
5. Click "Execute" to test

### Unit Tests

```bash
# Run all tests
pytest tests/

# Run specific test file
pytest tests/test_rag_system.py

# Run with coverage
pytest --cov=app tests/
```

### Test Structure

```
tests/
├── test_api_endpoints.py
├── test_document_loader.py
├── test_rag_system.py
├── test_watsonx_chat.py
└── test_schemas.py
```

### Manual Testing

```python
# Test FastAPI app
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# Test ask endpoint
response = client.post("/v1/ask/", json={
    "messages": [
        {
            "id": "2025-11-07T13:56:00Z",
            "role": "user",
            "content": "Test question"
        }
    ]
})
print(response.json())

# Test add question endpoint
response = client.post("/v1/add_question/", json={
    "titre": "Test",
    "contenu": "Test content",
    "ecoles": "ESILV", 
    "utilisateurs": "student",
    "langue": "Français"
})
print(response.json())
```

## 📊 Performance Optimization

### Vector Database Optimization

```python
# Adjust chunk size for better retrieval
rag_system = RAGSystem(
    chunk_size=500,        # Characters per chunk
    chunk_overlap=50       # Overlap between chunks
)

# Optimize MMR diversity
retriever = rag.get_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 8,
        "fetch_k": 20,      # Fetch more candidates
        "lambda_mult": 0.5  # 0=diverse, 1=relevant
    }
)
```

### Embedding Optimization

```python
# Use GPU if available
import torch
device = "cuda" if torch.cuda.is_available() else "cpu"

embeddings = HuggingFaceEmbeddings(
    model_name="intfloat/multilingual-e5-large",
    model_kwargs={"device": device}
)
```

### Caching

```python
from langchain.cache import InMemoryCache
import langchain

# Enable LangChain caching
langchain.llm_cache = InMemoryCache()
```

## 🐛 Troubleshooting

### Issue: FastAPI Server Won't Start

**Symptoms:**
```
ImportError: No module named 'fastapi'
AttributeError: module 'uvicorn' has no attribute 'run'
```

**Solutions:**
1. Install missing dependencies:
```bash
pip install fastapi uvicorn[standard]
```

2. Check Python version compatibility
3. Activate virtual environment properly

### Issue: CORS Errors from Frontend

**Symptoms:**
```
Access-Control-Allow-Origin header missing
CORS request blocked
```

**Solutions:**
1. Verify CORS middleware configuration in `main.py`
2. Check frontend URL matches allowed origins
3. Restart FastAPI server after CORS changes

### Issue: 422 Unprocessable Entity

**Symptoms:**
```
HTTP 422 error on API requests
Validation error in request body
```

**Solutions:**
1. Validate request JSON format matches schema
2. Check required fields are present
3. Verify enum values are correct
4. Use API docs (`/docs`) to see expected format

### Issue: Authentication Errors

**Symptoms:**
```
Error 401: Unauthorized
Invalid API key or expired token
```

**Solutions:**
1. Verify `.env` credentials are correct
2. Check API key hasn't expired
3. Ensure Project ID matches your watsonx.ai project
4. Verify IBM_URL endpoint is correct for your region

### Issue: Vector Database Not Found

**Symptoms:**
```
FileNotFoundError: [Errno 2] No such file or directory: 'source/database/prod'
```

**Solutions:**
```bash
# Create directory structure
mkdir -p source/database/prod

# Or delete and rebuild
rm -rf source/database/prod
python main.py  # Will rebuild on next run
```

### Issue: Out of Memory

**Symptoms:**
```
MemoryError: Unable to allocate array
```

**Solutions:**
1. Reduce batch size:
```python
rag_system = RAGSystem(batch_size=32)  # Default: 100
```

2. Process documents in smaller chunks
3. Use a smaller embedding model
4. Increase system RAM

### Issue: Slow Response Times

**Solutions:**
1. Enable GPU for embeddings
2. Reduce retrieval count (`k` parameter)
3. Use simpler retrieval strategy (similarity vs MMR)
4. Cache frequently asked questions

### Issue: Poor Answer Quality

**Solutions:**
1. Adjust retrieval parameters:
```python
search_kwargs={"k": 12, "fetch_k": 30}  # Retrieve more context
```

2. Tune generation parameters:
```python
llm = IBMWatsonxChat(
    temperature=0.3,  # More focused
    top_p=0.85       # Less random
)
```

3. Improve prompt engineering
4. Enrich FAQ data with more details

## 📈 Monitoring & Logging

### Enable Detailed Logging

```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('backend.log'),
        logging.StreamHandler()
    ]
)
```

### Track Performance Metrics

```python
import time

def track_query(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        duration = time.time() - start
        print(f"Query took {duration:.2f}s")
        return result
    return wrapper

@track_query
def process_question(question):
    # Your processing logic
    pass
```

## 🔐 Security Best Practices

1. **Never commit `.env` files**
```bash
# Add to .gitignore
.env
*.env
.env.*
```

2. **Rotate API keys regularly**
3. **Use environment-specific credentials**
4. **Implement rate limiting**
5. **Validate all inputs**
6. **Sanitize user queries**

## 📚 Additional Resources

- [LangChain Documentation](https://python.langchain.com/)
- [Chroma Documentation](https://docs.trychroma.com/)
- [IBM watsonx.ai Documentation](https://www.ibm.com/docs/en/watsonx-as-a-service)
- [HuggingFace Models](https://huggingface.co/models)

## 🤝 Contributing

See the main [README.md](../../README.md) for contribution guidelines.

## 📧 Support

For technical questions: [kryptosphere@devinci.fr](mailto:kryptosphere@devinci.fr)

---

**Built with ❤️ for the IBM Hackathon at Pôle Léonard de Vinci**