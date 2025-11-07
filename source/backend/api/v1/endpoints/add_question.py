from fastapi import APIRouter
from schemas.question import QuestionSchema
from tools.rag_system import RAGSystem

router = APIRouter()

@router.post("/", summary="Add a new question")
async def add_question(question: QuestionSchema):

    try:

        rag_system = RAGSystem(
                persist_directory="../database/prod"
        )

        rag_system.add_question(
            titre=question.titre,
            contenu=question.contenu,
            thematique=question.thematique,
            ecoles=question.ecoles,
            utilisateurs=question.utilisateurs,
            langue=question.langue,
        )

        return {"status": "200", "message": "Question added successfully"}
    
    except Exception as e:
        return {"status": "500", "message": str(e)}