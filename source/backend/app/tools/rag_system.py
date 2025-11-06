from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from typing import List
import os


class RAGSystem:
    """Système RAG avec Chroma et embeddings HuggingFace"""

    def __init__(
        self,
        documents: List[Document],
        persist_directory: str,
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
    
    def search(self, query: str, k: int = 3) -> List[Document]:
        """
        Recherche les documents similaires à la requête.
        
        Args:
            query: Question de l'utilisateur
            k: Nombre de documents à retourner
            
        Returns:
            Liste des documents les plus pertinents
        """
        return self.vectorstore.similarity_search(query, k=k)
