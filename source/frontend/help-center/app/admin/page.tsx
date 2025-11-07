"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/utils/Card";
import { MessageSquare } from "lucide-react";

// Liste hardcodée de questions + contexte pour le POC
const MOCK_QUESTIONS: { question: string; contexte?: string }[] = [
  {
    question: "Comment réinitialiser mon mot de passe ?",
    contexte:
      "Comment réinitialiser mon mot de passe ? — Chatbot: Pour réinitialiser votre mot de passe, cliquez sur 'Mot de passe oublié' et suivez les instructions. — Étudiant: Je n'arrive toujours pas à recevoir l'email. — Chatbot: Vérifiez votre dossier spam ; si rien ne s'affiche, contactez le support pour renvoyer l'email.",
  },
  {
    question: "Où trouver mon emploi du temps ?",
    contexte:
      "Où trouver mon emploi du temps ? — Chatbot: Votre emploi du temps est disponible dans l'onglet 'Mon planning' après connexion. — Étudiant: Il n'apparaît pas pour mon groupe. — Chatbot: Vérifiez vos inscriptions de groupe dans l'espace étudiant ou contactez la scolarité pour qu'ils valident votre groupe.",
  },
  {
    question: "Comment accéder à la bibliothèque en ligne ?",
    contexte:
      "Comment accéder à la bibliothèque en ligne ? — Chatbot: Connectez-vous avec vos identifiants universitaires (SSO). — Étudiant: Le SSO renvoie une erreur 401. — Chatbot: Déconnectez-vous puis reconnectez-vous ; si l'erreur persiste, ouvrez un ticket au support technique avec une capture d'écran.",
  },
  {
    question: "Quelles sont les démarches pour un stage à l'étranger ?",
    contexte:
      "Quelles sont les démarches pour un stage à l'étranger ? — Chatbot: Contactez le service relations internationales et suivez la procédure d'inscription. — Étudiant: Dois-je valider des crédits avant de partir ? — Chatbot: Consultez la fiche programme ; certaines validations sont requises selon votre parcours, le service pourra vous préciser le cas.",
  },
  {
    question: "Comment contacter le service scolarité ?",
    contexte: "Comment contacter le service scolarité ? — Chatbot: Par email à scolarite@ecole.edu ou via le formulaire en ligne. — Étudiant: Quel est le délai de réponse moyen ? — Chatbot: Le délai moyen est de 48-72 heures hors périodes d'affluence.",
  },
  {
    question: "Où se trouve la cafétéria ?",
    contexte: "Où se trouve la cafétéria ? — Chatbot: La cafétéria principale est au bâtiment A, rez-de-chaussée. — Étudiant: Y a-t-il des options végétariennes ? — Chatbot: Oui, des options végétariennes et véganes sont disponibles tous les jours.",
  },
  {
    question: "Comment s'inscrire aux examens ?",
    contexte: "Comment s'inscrire aux examens ? — Chatbot: L'inscription se fait sur l'espace étudiant, rubrique 'Examens'. — Étudiant: La date limite est dépassée, que faire ? — Chatbot: Contactez la scolarité au plus vite ; ils pourront vous indiquer si une procédure exceptionnelle est possible.",
  },
  {
    question: "Quels sont les horaires d'ouverture du campus ?",
    contexte: "Quels sont les horaires d'ouverture du campus ? — Chatbot: Le campus est ouvert de 8h à 20h en semaine. — Étudiant: Y a-t-il des accès le weekend ? — Chatbot: Certains bâtiments restent accessibles le weekend via badge ; vérifiez les horaires et accès sur la page des services.",
  },

];

export default function AdminPage() {
  const router = useRouter();

  const handleQuestionClick = (
    item: { question: string; contexte?: string },
    index: number
  ) => {
    // Encode la question et le contexte pour l'URL
    const encodedQuestion = encodeURIComponent(item.question);
    const encodedContext = item.contexte ? encodeURIComponent(item.contexte) : "";
    const contextParam = encodedContext ? `&context=${encodedContext}` : "";
    router.push(`/admin/form?question=${encodedQuestion}&id=${index}${contextParam}`);
  };

  return (
    <div className="mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-black">Administration</h1>
        <p className="text-gray-600">
          Sélectionnez une question pour y répondre et configurer ses paramètres
        </p>
      </div>

      <Card>
        <div className="py-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
            <MessageSquare className="w-5 h-5" />
            Questions en attente de réponse
          </h2>
          <div className="space-y-2">
            {MOCK_QUESTIONS.map((item, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(item, index)}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-purple-accent hover:bg-grey-button transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-gray-100 group-hover:bg-grey-button flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600 group-hover:text-purple-accent">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 group-hover:text-purple-accent font-medium">
                      {item.question}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-purple-accent flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
