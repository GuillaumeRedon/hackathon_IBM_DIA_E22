from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from datetime import datetime
from typing import List
import os
import uuid

from tools.document_loader import build_document_from_fields



class RAGSystem:
    """Système RAG avec Chroma et embeddings HuggingFace"""

    def __init__(
        self,
        documents: List[Document]=None,
        persist_directory: str="",
        embedding_model: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    ):
        """
        Initialise le système RAG.
        
        Args:
            documents: Liste de documents à indexer
            persist_directory: Répertoire pour persister la base Chroma
            embedding_model: Modèle d'embeddings (multilingue pour français)
        """
        self.persist_directory = persist_directory
        
        # Initialiser les embeddings (modèle multilingue pour le français)
        print(f"⏳ Chargement du modèle d'embeddings: {embedding_model}")
        self.embeddings = HuggingFaceEmbeddings(
            model_name=embedding_model,
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        print("✓ Modèle d'embeddings chargé")
        
        # Créer ou charger la base vectorielle Chroma
        # Vérifier si la base existe déjà avec des données
        db_exists = False
        if os.path.exists(persist_directory):
            try:
                # Essayer de charger une base existante
                test_store = Chroma(
                    persist_directory=persist_directory,
                    embedding_function=self.embeddings
                )
                # Vérifier qu'elle contient des documents
                if test_store._collection.count() > 0:
                    db_exists = True
                    self.vectorstore = test_store
                    print(f"✓ Base vectorielle chargée depuis {persist_directory} ({test_store._collection.count()} documents)")
            except:
                db_exists = False
        
        if not db_exists:
            if documents is None:
                raise ValueError("Aucun document fourni pour initialiser la base vectorielle.")
            print(f"⏳ Création de la base vectorielle avec {len(documents)} documents...")
            print("   Cela peut prendre quelques minutes pour générer les embeddings...")
            
            # Créer le dossier s'il n'existe pas
            os.makedirs(persist_directory, exist_ok=True)
            
            # Créer la base vectorielle et la persister
            self.vectorstore = Chroma.from_documents(
                documents=documents,
                embedding=self.embeddings,
                persist_directory=persist_directory
            )
            
            print(f"✓ Base vectorielle créée et sauvegardée dans {persist_directory}")
        
        # Créer le retriever
        self.retriever = self.vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 6}  # Retourner les 6 documents les plus similaires
        )
    
    def get_retriever(self):
        """Retourne le retriever pour utilisation dans une chaîne RAG"""
        return self.retriever
    
    def add_question(
        self,
        titre: str,
        contenu: str,
        thematique: str,
        ecoles: str,
        utilisateurs: str,
        langue: str,
        date: str = datetime.now().strftime("%Y-%m-%d"),
        post_type: str = "",
        status: str = ""
    ):
        """
        Ajoute ou met à jour une question dans la base vectorielle.
        """
        generated_id = str(uuid.uuid4())
        doc = build_document_from_fields(
            question_id=generated_id,
            titre=titre,
            contenu=contenu,
            thematique=thematique,
            ecoles=ecoles,
            utilisateurs=utilisateurs,
            langue=langue,
            date=date,
            post_type=post_type,
            status=status,
        )

        doc_id = generated_id

        # Supprime un ancien document portant le même ID si présent
        try:
            self.vectorstore.delete(ids=[doc_id])
        except Exception:
            pass  # l’ID n’existait pas encore

        self.vectorstore.add_documents([doc], ids=[doc_id])
        #self.vectorstore.persist()