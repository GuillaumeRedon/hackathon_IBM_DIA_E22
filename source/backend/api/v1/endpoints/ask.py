from fastapi import APIRouter
from schemas.message import MessageList
from tools.rag_system import RAGSystem
from tools.IBMWatsonxChat import IBMWatsonxChat
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os

router = APIRouter()

def format_docs(docs):
    """Formate les documents récupérés pour le contexte"""
    return "\n\n".join(
        f"Document {i+1} (ID: {doc.metadata.get('id', 'N/A')}):\n{doc.page_content}" 
        for i, doc in enumerate(docs)
    )

def format_conversation(messages: list):
    """Formate l'historique de conversation"""
    conversation = []
    for msg in messages:
        role_label = "Utilisateur" if msg.role == "user" else "Assistant"
        conversation.append(f"{role_label}: {msg.content}")
    return "\n".join(conversation)

@router.post("/", summary="Ask something to the AI")
async def ask(messages: MessageList):

    try:
        # Extraire la dernière question de l'utilisateur
        user_messages = [msg for msg in messages.messages if msg.role == "user"]
        if not user_messages:
            return {"status": "400", "message": "Aucune question utilisateur trouvée"}
        
        last_user_question = user_messages[-1].content
        
        # Initialiser le système RAG
        rag_system = RAGSystem(
                persist_directory="../database/prod"
        )

        # Initialiser le LLM
        llm = IBMWatsonxChat(
            api_key=os.getenv("WATSON_API_KEY", None),
            project_id=os.getenv("PROJECT_ID", None),
            model_id="meta-llama/llama-3-3-70b-instruct",
            api_url=os.getenv("IBM_URL", None),
        )

        # Template incluant RAG + historique de conversation
        template = """Tu es un assistant virtuel pour une école. Tu dois répondre à la dernière question de l'utilisateur en t'appuyant sur:
1. Les documents de la base de connaissances ci-dessous
2. L'historique de la conversation pour comprendre le contexte

RÈGLES IMPORTANTES:
- Utilise les informations des documents pour répondre, même si la formulation de la question n'est pas exactement la même que dans les documents
- Si les documents contiennent des informations pertinentes qui peuvent aider à répondre, utilise-les pour construire ta réponse
- Sois clair et pédagogique dans tes explications
- Si vraiment AUCUNE information dans les documents ne peut aider à répondre (par exemple une question sur la météo), dis alors : "Je n'ai pas d'information sur ce sujet dans ma base de connaissances."
- Ne réponds QU'À la dernière question posée
- Utilise l'historique pour comprendre le contexte de la conversation

=== DOCUMENTS DE LA BASE DE CONNAISSANCES ===
{context}

=== HISTORIQUE DE LA CONVERSATION ===
{conversation_history}

=== DERNIÈRE QUESTION À RÉPONDRE ===
{question}

Réponse de l'assistant:"""

        prompt = ChatPromptTemplate.from_template(template)

        # Créer la chaîne RAG avec conversation
        # Utilise le retriever pour une intégration propre avec LangChain
        def get_context(x):
            docs = rag_system.get_retriever().invoke(x["question"])
            return format_docs(docs)
        
        rag_chain = (
            {
                "context": get_context,
                "conversation_history": lambda x: format_conversation(x["messages"]),
                "question": lambda x: x["question"]
            }
            | prompt
            | llm
            | StrOutputParser()
        )

        # Invoquer avec la question et l'historique
        response = rag_chain.invoke({
            "question": last_user_question,
            "messages": messages.messages
        })

        return {"status": "200", "message": response}
    
    except Exception as e:

        return {"status": "500", "message": f"Error: {str(e)}"}