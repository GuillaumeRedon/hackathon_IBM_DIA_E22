# Backend - RAG System Documentation

## 📋 Overview

The backend is a sophisticated RAG (Retrieval-Augmented Generation) system built with Python, LangChain, and IBM watsonx.ai. It provides intelligent question-answering capabilities for the Pôle Léonard de Vinci Help Center by combining semantic search with generative AI.

## 🏗️ Architecture

### Core Components

```
source/backend/
├── app/
│   ├── tools/
│   │   ├── document_loader.py      # JSON to LangChain Documents
│   │   ├── rag_system.py           # Vector DB & Retrieval
│   │   └── IBMWatsonxChat.py       # watsonx.ai Integration
│   └── process.py                  # RAG Pipeline Orchestration
├── main.py                         # Application Entry Point
└── .env                            # Environment Configuration
```

### Data Flow

```
JSON FAQ Data
     ↓
Document Loader (Metadata Enrichment)
     ↓
RAG System (Chroma Vector DB + HuggingFace Embeddings)
     ↓
Retrieval (MMR Algorithm, k=8)
     ↓
Prompt Construction (Context + Question)
     ↓
IBM watsonx.ai (Llama 3.3 70B)
     ↓
Generated Response
```

## 🔧 Technical Stack

### Core Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| **Python** | 3.10+ | Runtime environment |
| **LangChain** | Latest | RAG orchestration framework |
| **langchain-community** | Latest | Community integrations |
| **langchain-chroma** | Latest | Chroma vector store integration |
| **chromadb** | Latest | Vector database |
| **langchain-core** | Latest | Core LangChain abstractions |
| **ibm-cloud-sdk-core** | Latest | IBM Cloud authentication |
| **python-dotenv** | Latest | Environment variable management |
| **requests** | Latest | HTTP client for API calls |

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

pip install langchain \
            langchain-community \
            langchain-chroma \
            chromadb \
            langchain-core \
            ibm-cloud-sdk-core \
            python-dotenv \
            requests
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

### Basic Execution

```bash
# Ensure you're in the backend directory with activated venv
cd source/backend
python main.py
```

### First Run Behavior

On the first execution:
- Reads the FAQ data from `source/database/samples/clean-json-file.json`
- Creates embeddings using HuggingFace model (may take 2-5 minutes)
- Persists the vector database to `source/database/prod/`
- Processes the example question

**Console Output:**
```
Création de la base vectorielle...
Chargement des documents...
✓ 150 documents chargés
✓ Base vectorielle créée et persistée
Question: Quelles sont les démarches à faire pour un stage en entreprise ?
Recherche dans la base...
Appel à watsonx.ai...
Réponse: [Generated answer]
```

### Subsequent Runs

- Automatically loads the persisted vector database
- Much faster startup (< 5 seconds)
- Ready to process queries immediately

## 📝 Component Documentation

### 1. Document Loader (`document_loader.py`)

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

### 2. RAG System (`rag_system.py`)

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

### 3. IBM Watsonx Chat (`IBMWatsonxChat.py`)

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

### 4. Process (`process.py`)

**Purpose**: Orchestrates the complete RAG pipeline.

**Pipeline Stages:**

```python
from app.process import RAGProcessor

processor = RAGProcessor(
    llm=watsonx_llm,
    rag_system=rag_system
)

# Complete pipeline
response = processor.process_question(
    question="Quelles sont les démarches pour un stage ?",
    user_context={
        "school": "ESILV",
        "user_type": "student"
    }
)
```

**Prompt Engineering:**

The system uses a carefully crafted prompt:

```python
system_prompt = """
Tu es l'assistant virtuel du Pôle Léonard de Vinci.

Contexte:
{context}

Rôle:
- Réponds de manière claire et concise
- Utilise les informations du contexte
- Si tu ne sais pas, indique-le poliment
- Maintiens un ton professionnel et amical

Question: {question}

Réponse:
"""
```

**Context Management:**
- Retrieves top 8 most relevant documents
- Formats context with metadata
- Injects into prompt template
- Generates response with watsonx.ai

## 🔄 Advanced Features

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
├── test_document_loader.py
├── test_rag_system.py
├── test_watsonx_chat.py
└── test_process.py
```

### Manual Testing

```python
# Test document loading
from app.tools.document_loader import DocumentLoader
loader = DocumentLoader("source/database/samples/clean-json-file.json")
docs = loader.load()
print(f"Loaded {len(docs)} documents")

# Test embeddings
from app.tools.rag_system import RAGSystem
rag = RAGSystem()
results = rag.similarity_search("test query", k=3)

# Test watsonx.ai connection
from app.tools.IBMWatsonxChat import IBMWatsonxChat
llm = IBMWatsonxChat(...)
response = llm.invoke("Hello, test message")
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