import json
from typing import List
from langchain_core.documents import Document

def build_document_from_fields(
    question_id: int,
    titre: str,
    contenu: str,
    thematique: str,
    ecoles: str,
    utilisateurs: str,
    langue: str,
    date: str = "",
    post_type: str = "",
    status: str = ""
) -> Document:
    """
    Construit un Document LangChain depuis des champs individuels
    en respectant le format existant.
    """
    text_content = f"""[Écoles: {ecoles or 'N/A'}] [Thématique: {thematique or ''}]

Question: {titre}

Réponse: {contenu}"""

    metadata = {
        "id": question_id,
        "title": titre,
        "date": date,
        "post_type": post_type,
        "langues": langue,
        "thematiques": thematique,
        "utilisateurs": utilisateurs or "N/A",
        "ecoles": ecoles or "N/A",
        "status": status,
    }

    return Document(page_content=text_content, metadata=metadata)


def load_qa_documents(json_path: str) -> List[Document]:
    """
    Charge les documents Q&A depuis le fichier JSON.
    
    Args:
        json_path: Chemin vers le fichier QA_clean.json
        
    Returns:
        Liste de Documents LangChain avec métadonnées
    """
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    documents = []
    for item in data:
        # Créer le contenu textuel enrichi avec contexte important
        ecoles = ', '.join(item.get('Écoles', [])) if item.get('Écoles', []) else 'N/A'
        thematiques = item.get('Thématiques', '')
        
        text_content = f"""[Écoles: {ecoles}] [Thématique: {thematiques}]

Question: {item.get('Title', '')}

Réponse: {item.get('Content', '')}"""
        
        # Créer les métadonnées (pour filtrage et traçabilité)
        metadata = {
            'id': item.get('id'),
            'title': item.get('Title', ''),
            'date': item.get('Date', ''),
            'post_type': item.get('Post Type', ''),
            'langues': item.get('Langues', ''),
            'thematiques': item.get('Thématiques', ''),
            'utilisateurs': ', '.join(item.get('Utilisateurs', [])) if item.get('Utilisateurs', []) else 'N/A',
            'ecoles': ecoles,
            'status': item.get('Status', '')
        }

        # Créer le document LangChain
        doc = Document(page_content=text_content, metadata=metadata)
        documents.append(doc)

    print(f"✓ Chargé {len(documents)} documents depuis {json_path}")
    return documents
