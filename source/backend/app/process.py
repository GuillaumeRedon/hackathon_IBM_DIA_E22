from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from app.tools.document_loader import load_qa_documents
from app.tools.rag_system import RAGSystem
import os


def format_docs(docs):
    """Formate les documents récupérés pour le contexte"""
    return "\n\n".join(
        f"Document {i+1} (ID: {doc.metadata.get('id', 'N/A')}):\n{doc.page_content}" 
        for i, doc in enumerate(docs)
    )


def main(
    api_key: str,
    project_id: str,
    url: str,
    model_id: str,
    model_builder,
):
    print("=" * 80)
    print("🚀 Démarrage du système RAG")
    print("=" * 80)
    
    # 1. Charger les documents Q&A
    json_path = "./source/database/samples/clean-json-file.json"
    documents = load_qa_documents(json_path)
    
    # 2. Initialiser le système RAG avec Chroma
    rag_system = RAGSystem(
        documents=documents,
        persist_directory="./source/database/prod"
    )
    
    # 3. Créer le LLM IBM Watsonx
    print("⏳ Initialisation du LLM IBM Watsonx...")
    llm = model_builder(
        api_key=api_key,
        project_id=project_id,
        model_id=model_id,
        api_url=url,
    )
    print("✓ LLM initialisé")
    
    # 4. Créer le prompt template pour le RAG
    template = (
        "Tu es un assistant virtuel pour une école. Je vais te donner les questions qui ressemblent le plus à celle de l'utilisateur et leurs réponses.\n"
        "Si tu ne trouves pas la réponse dans le contexte, dis-le clairement.\n"
        "Soit clair avec l'utilisateur sur ce que tu trouves\n"
        "Voici les questions et réponses de l'école:\n\n"

        "{context}\n\n"

        "Réponds uniquement à la question suivante posée par l'utilisateur en utilisant les réponses de l'école:\n"
        "{question}\n\n"

        "Réponse:"
    )
    
    prompt = ChatPromptTemplate.from_template(template)
    
    # 5. Créer la chaîne RAG
    rag_chain = (
        {
            "context": rag_system.get_retriever() | format_docs,
            "question": RunnablePassthrough()
        }
        | prompt
        | llm
        | StrOutputParser()
    )
    
    print("\n" + "=" * 80)
    print("✅ Système RAG prêt !")
    print("=" * 80 + "\n")
    
    # 6. Exemple de question
    question = "Qu'est-ce qui peut excuser une absence ?"
    
    # Génération de la réponse
    print("⏳ Génération de la réponse...\n")
    response = rag_chain.invoke(question)
    
    print("=" * 80)
    print("💬 Réponse du système RAG:")
    print("=" * 80)
    print(response)
    print("=" * 80)
