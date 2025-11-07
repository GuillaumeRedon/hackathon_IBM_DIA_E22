"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/utils/Card";
import { MessageSquare, Clock, User, Mail } from "lucide-react";
import { useAdminHelpRequests } from "@/hooks/useAdminHelpRequests";
import { formatConversationForDisplay } from "@/utils/helpRequestStorage";


export default function AdminPage() {
  const router = useRouter();
  const { pendingRequests, loading } = useAdminHelpRequests();

  const handleQuestionClick = (
    request: any,
    index: number
  ) => {
    if (request.id) {
      const encodedQuestion = encodeURIComponent(request.firstQuestion);
      const encodedContext = encodeURIComponent(formatConversationForDisplay(request.conversation));
      router.push(`/admin/form?question=${encodedQuestion}&id=${request.id}&context=${encodedContext}&email=${request.userEmail}`);
    }
  };

  return (
    <div className="mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-black">Administration</h1>
        <p className="text-gray-600">
          Sélectionnez une question pour y répondre et configurer ses paramètres
        </p>
      </div>

      {loading ? (
        <Card>
          <div className="py-8 text-center text-gray-500">
            Chargement des demandes d'aide...
          </div>
        </Card>
      ) : (
        <>
          {pendingRequests.length > 0 && (
            <Card>
              <div className="py-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
                  <MessageSquare className="w-5 h-5" />
                  Demandes d'aide en attente ({pendingRequests.length})
                </h2>
                <div className="space-y-2">
                  {pendingRequests.map((request, index) => (
                    <button
                      key={request.id}
                      onClick={() => handleQuestionClick(request, index)}
                      className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-purple-accent hover:bg-grey-button transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-6 h-6 rounded-full bg-gray-100 group-hover:bg-grey-button flex items-center justify-center shrink-0">
                          <span className="text-sm font-medium text-gray-600 group-hover:text-purple-accent">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 group-hover:text-purple-accent font-medium">
                            {request.firstQuestion}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {request.userEmail}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(request.date).toLocaleDateString('fr-FR')}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {request.conversation.length} messages
                            </span>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-purple-accent shrink-0 mt-1"
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
          )}

          {pendingRequests.length === 0 && (
            <Card>
              <div className="py-8 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Aucune demande d'aide en attente</p>
                <p className="text-sm">
                  Les nouvelles demandes d'aide apparaîtront ici lorsque les utilisateurs 
                  demanderont l'assistance d'un administrateur.
                </p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
