# IBM Hackathon DIA E22 - RAG-Powered Help Center

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![LangChain](https://img.shields.io/badge/LangChain-🦜-green.svg)](https://python.langchain.com/)
[![IBM watsonx.ai](https://img.shields.io/badge/IBM-watsonx.ai-0530ad.svg)](https://www.ibm.com/watsonx)

A Retrieval-Augmented Generation (RAG) system built for the IBM Hackathon, designed to provide intelligent assistance for the Pôle Léonard de Vinci using LangChain, Chroma vector database, and IBM watsonx.ai.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Contact](#contact)

## 🎯 Overview

This project implements a RAG-based question-answering system that leverages:
- **LangChain** for prompt orchestration and RAG workflow
- **Chroma** as a local persistent vector database
- **IBM watsonx.ai** for generative AI capabilities (Llama 3.3 70B)
- **HuggingFace embeddings** (multilingual-e5-large) for semantic search

The system is designed to answer questions about the Pôle Léonard de Vinci by retrieving relevant information from a curated knowledge base and generating contextually appropriate responses.

## ✨ Features

- 🔍 **Semantic Search**: Uses HuggingFace embeddings for accurate document retrieval
- 🧠 **RAG Pipeline**: Combines retrieval with IBM watsonx.ai for informed responses
- 💾 **Persistent Storage**: Chroma vector database stored locally for quick reuse
- 🌐 **Multilingual Support**: E5-large embeddings support multiple languages
- 🎨 **Frontend Interface**: React-based help center UI
- 🔄 **Dynamic Updates**: Add new Q&A pairs without rebuilding the entire database

## 🏗️ Architecture

```
┌─────────────────┐
│   User Query    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│      Document Loader                │
│  (JSON → LangChain Documents)       │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│      RAG System (Chroma)            │
│  • HuggingFace Embeddings           │
│  • MMR Retrieval (k=8)              │
│  • Persistent Storage               │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│   IBM watsonx.ai Chat               │
│  • Llama 3.3 70B Instruct           │
│  • IAM Authentication               │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────┐
│    Response     │
└─────────────────┘
```

## 📦 Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: For the frontend (npm)
- **IBM Cloud Account**: With access to watsonx.ai
- **Git**: For cloning the repository

## 🚀 Installation

### 1. Fork & Clone the Repository

```bash
# Fork the repository on GitHub (top right button)
# Then clone your fork
git clone https://github.com/<your-username>/hackathon_IBM_DIA_E22.git
cd hackathon_IBM_DIA_E22
```

**Important**: Ensure your fork is set to **public** visibility:
- Go to: Settings → Change repository visibility → Public

### 2. Backend Setup

```bash
cd source/backend

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install langchain langchain-community langchain-chroma chromadb \
            langchain-core ibm-cloud-sdk-core python-dotenv requests
```

### 3. Frontend Setup

```bash
cd source/frontend/help-center

# Install dependencies and start
npm install
npm run dev
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with your IBM Cloud credentials:

```env
WATSON_API_KEY=your_watson_api_key_here
PROJECT_ID=your_project_id_here
IBM_URL=https://your-watsonx-endpoint/ml/v1/text/chat?version=...
```

**How to get these credentials:**
1. Log in to [IBM Cloud](https://cloud.ibm.com/)
2. Navigate to your watsonx.ai instance
3. Find your API key and Project ID in the service credentials
4. Copy the appropriate API endpoint URL

### Model Configuration

You can change the generative model in `main.py`:

```python
model_id = "meta-llama/llama-3-3-70b-instruct"  # Change this to use a different model
```

## 💻 Usage

### Running the Backend

```bash
cd source/backend
python main.py
```

**First Run**: The system will create the vector database from `source/database/samples/clean-json-file.json`. This may take a few minutes.

**Subsequent Runs**: The system will load the persisted embeddings, starting much faster.

### Running the Frontend

```bash
cd source/frontend/help-center
npm run dev
```

Then open your browser to the URL shown in the terminal (typically `http://localhost:5173`).

## 📁 Project Structure

```
hackathon_IBM_DIA_E22/
├── source/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── tools/
│   │   │   │   ├── document_loader.py      # JSON to LangChain Document converter
│   │   │   │   ├── rag_system.py           # Chroma vector DB & retrieval
│   │   │   │   └── IBMWatsonxChat.py       # IBM watsonx.ai API wrapper
│   │   │   └── process.py                  # RAG chain assembly
│   │   └── main.py                         # Entry point & orchestration
│   ├── frontend/
│   │   └── help-center/                    # React frontend
│   └── database/
│       ├── samples/
│       │   └── clean-json-file.json        # Source FAQ data
│       └── prod/                           # Persisted Chroma database
└── .env                                    # Environment variables (not in repo)
```

## 🔧 How It Works

### 1. Document Loading (`document_loader.py`)

Converts the JSON Q&A file into LangChain `Document` objects enriched with metadata:
- Schools
- Topics/Themes
- Users
- Custom attributes

### 2. RAG System (`rag_system.py`)

- **Embeddings**: Uses `intfloat/multilingual-e5-large` from HuggingFace
- **Vector Store**: Chroma database with local persistence (`source/database/prod`)
- **Retrieval**: MMR (Maximal Marginal Relevance) algorithm with k=8 for diverse results
- **Automatic Management**: Creates DB on first run, reuses on subsequent runs

### 3. IBM watsonx Integration (`IBMWatsonxChat.py`)

Custom `BaseChatModel` implementation that:
- Handles IAM authentication with IBM Cloud
- Makes REST API calls to watsonx.ai
- Wraps the Llama 3.3 70B Instruct model

### 4. RAG Pipeline (`process.py`)

Orchestrates the complete flow:
1. Retrieves most relevant documents from Chroma
2. Constructs a prompt with context for the Pôle Léonard de Vinci assistant
3. Generates responses using IBM watsonx.ai
4. Returns the final answer

## 🎨 Customization

### Adding New Q&A Pairs

**Method 1: Update the JSON file**
```json
// Edit source/database/samples/clean-json-file.json
{
  "question": "Your new question?",
  "answer": "The answer to provide",
  "metadata": {
    "school": "ESILV",
    "topic": "Admissions"
  }
}
```
Then delete the `source/database/prod` folder and restart to rebuild the database.

**Method 2: Dynamic insertion**
```python
# In your code (see process.py for example)
rag_system.add_question(
    question="New question?",
    answer="New answer",
    metadata={"school": "EMLV", "topic": "Courses"}
)
```

### Adjusting RAG Parameters

In `process.py`, modify retrieval settings:

```python
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 8, "fetch_k": 20}  # Adjust these values
)
```

### Customizing the Prompt

Edit the system prompt in `process.py` to change the assistant's tone or behavior:

```python
system_prompt = """
Your custom prompt here...
Adjust the role, tone, and instructions as needed.
"""
```

## 🐛 Troubleshooting

### Authentication Errors

**Problem**: `401 Unauthorized` or authentication failures

**Solutions**:
- Verify `WATSON_API_KEY` and `PROJECT_ID` in `.env`
- Check that the IBM_URL endpoint is correct (should end with `/ml/v1/text/chat?version=...`)
- Ensure your IBM Cloud account has access to watsonx.ai
- Try regenerating your API key in IBM Cloud

### Vector Database Issues

**Problem**: Embeddings not loading or database corruption

**Solutions**:
- Delete the `source/database/prod` folder
- Restart the application to rebuild the database
- Check that `clean-json-file.json` is valid JSON

### Dependency Conflicts

**Problem**: Package installation errors

**Solutions**:
```bash
# Create a fresh virtual environment
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install --upgrade pip
pip install -r requirements.txt  # if available, or install packages individually
```

### Memory Issues

**Problem**: Out of memory when creating embeddings

**Solutions**:
- Process documents in smaller batches
- Use a smaller embedding model
- Increase available RAM or use a machine with more resources

## 📊 Logs and Debugging

The console output shows detailed information about each step:
- Document loading progress
- Vector database creation/loading
- watsonx.ai API calls
- Retrieved documents and generated responses

Enable verbose logging by setting:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 🤝 Contributing

1. Create a feature branch:
   ```bash
   git checkout -b feature/my-awesome-feature
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Add: my awesome feature"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/my-awesome-feature
   ```

4. Create a Pull Request on GitHub

**Requirements**:
- ✅ Keep your fork **public** during the hackathon
- ✅ Follow the existing code structure
- ✅ Add tests for new features (if applicable)
- ✅ Update documentation as needed

## 📧 Contact

For questions or support during the hackathon:

📬 Email: [kryptosphere@devinci.fr](mailto:kryptosphere@devinci.fr)

## 🏆 Hackathon Guidelines

- Keep your repository **public** throughout the event
- Follow the provided template structure
- Have fun and learn!

## 📄 License

This project is part of the IBM Hackathon at Pôle Léonard de Vinci.

---

**Good luck during the IBM Hackathon — build, learn, and most importantly: have fun!** 🚀

Made with ❤️ for the IBM Hackathon DIA E22