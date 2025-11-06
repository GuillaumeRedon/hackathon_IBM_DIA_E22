"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/utils/Card";
import { MessageSquare } from "lucide-react";

// Liste hardcodée de questions pour le POC
const MOCK_QUESTIONS = [
  "Comment réinitialiser mon mot de passe ?",
  "Où trouver mon emploi du temps ?",
  "Comment accéder à la bibliothèque en ligne ?",
  "Quelles sont les démarches pour un stage à l'étranger ?",
  "Comment contacter le service scolarité ?",
  "Où se trouve la cafétéria ?",
  "Comment s'inscrire aux examens ?",
  "Quels sont les horaires d'ouverture du campus ?",
];

export default function AdminPage() {
  const router = useRouter();

  const handleQuestionClick = (question: string, index: number) => {
    // Encode la question pour l'URL
    const encodedQuestion = encodeURIComponent(question);
    router.push(`/admin/form?question=${encodedQuestion}&id=${index}`);
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
            {MOCK_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question, index)}
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
                      {question}
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
