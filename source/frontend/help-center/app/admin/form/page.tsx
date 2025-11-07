"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/utils/Card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ArrowLeft, Save, User, Mail, Clock } from "lucide-react";
import { useAdminHelpRequests } from "@/hooks/useAdminHelpRequests";

const LANGUES = ["Français", "English"];
const ECOLES = ["ESILV", "EMLV", "EXECUTIVE", "IIM"];
const UTILISATEURS = ["faculty", "staff", "student"];

function AdminFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getRequestById, updateRequestStatus } = useAdminHelpRequests();

  const [formData, setFormData] = useState({
    question: "",
    reponse: "",
    contexte: "",
    langue: "",
    ecole: "",
    utilisateur: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const questionParam = searchParams.get("question");
    const contextParam = searchParams.get("context") || searchParams.get("contexte");
    const idParam = searchParams.get("id");
    const emailParam = searchParams.get("email");
    
    const newFormData: any = {};
    let hasChanges = false;
    
    if (questionParam && questionParam !== formData.question) {
      newFormData.question = decodeURIComponent(questionParam);
      hasChanges = true;
    }

    if (contextParam && contextParam !== formData.contexte) {
      newFormData.contexte = decodeURIComponent(contextParam);
      hasChanges = true;
    }

    if (hasChanges) {
      setFormData((prev) => ({
        ...prev,
        ...newFormData,
      }));
    }

    if (idParam && !currentRequest) {
      const request = getRequestById(idParam);
      if (request) {
        setCurrentRequest(request);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const idParam = searchParams.get("id");
    if (idParam && !currentRequest) {
      const request = getRequestById(idParam);
      if (request) {
        setCurrentRequest(request);
      }
    }
  }, [getRequestById, searchParams, currentRequest]);

  const handleInputChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.question.trim()) newErrors.question = true;
    if (!formData.reponse.trim()) newErrors.reponse = true;
    if (!formData.langue) newErrors.langue = true;
    if (!formData.ecole) newErrors.ecole = true;
    if (!formData.utilisateur) newErrors.utilisateur = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const contenu = `Question: ${formData.question}\n\nRéponse: ${formData.reponse}`;

        const requestData = {
          titre: formData.question.length > 50 ? formData.question.substring(0, 50) + "..." : formData.question,
          contenu: contenu,
          thematique: "",
          ecoles: formData.ecole,
          utilisateurs: formData.utilisateur,
          langue: formData.langue
        };

        console.log("Données envoyées à l'API:", requestData);

        const response = await fetch('http://localhost:8000/v1/add_question/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        });

        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }

        const result = await response.json();
        console.log("Question ajoutée avec succès:", result);

        if (currentRequest) {
          updateRequestStatus(currentRequest.id, 'resolved');
          console.log("Demande d'aide résolue:", currentRequest.id);
        }
        
        console.log("Formulaire soumis:", formData);
        setShowSuccessModal(true);
        
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la question:', error);
        alert('Erreur lors de l\'enregistrement. Veuillez réessayer.');
      }
    }
  };

  const handleReturnToAdmin = () => {
    setShowSuccessModal(false);
    router.push("/admin");
  };

  return (
    <div className="mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => router.push("/admin")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à la liste
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-black">
          Répondre à une demande d'aide
        </h1>
        <p className="text-gray-600">
          Remplissez tous les champs obligatoires pour publier la réponse
        </p>
        
        {currentRequest && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">Informations de la demande</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <Mail className="w-4 h-4" />
                <span>{currentRequest.userEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <Clock className="w-4 h-4" />
                <span>{new Date(currentRequest.date).toLocaleString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <User className="w-4 h-4" />
                <span>{currentRequest.conversation.length} messages</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="py-4 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.question}
                onChange={(e) => handleInputChange("question", e.target.value)}
                placeholder="Reformulez la question si nécessaire..."
                className={`${errors.question ? "border-red-500" : ""} text-black`}
              />
              {errors.question && (
                <p className="text-red-500 text-sm mt-1">Ce champ est obligatoire</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conversation complète
              </label>
              <Textarea
                value={formData.contexte}
                readOnly
                placeholder="Aucun contexte disponible"
                rows={8}
                className="text-black bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Conversation complète entre l'utilisateur et le chatbot
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Réponse <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.reponse}
                onChange={(e) => handleInputChange("reponse", e.target.value)}
                placeholder="Entrez votre réponse détaillée..."
                rows={6}
                className={`${errors.reponse ? "border-red-500" : ""} text-black`}
              />
              {errors.reponse && (
                <p className="text-red-500 text-sm mt-1">Ce champ est obligatoire</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue <span className="text-red-500">*</span>
              </label>
              <Select
                options={LANGUES}
                value={formData.langue}
                onChange={(e) => handleInputChange("langue", e.target.value)}
                placeholder="Sélectionnez une langue"
                className={`${errors.langue ? "border-red-500" : ""} text-black`}
              />
              {errors.langue && (
                <p className="text-red-500 text-sm mt-1">Ce champ est obligatoire</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                École <span className="text-red-500">*</span>
              </label>
              <Select
                options={ECOLES}
                value={formData.ecole}
                onChange={(e) => handleInputChange("ecole", e.target.value)}
                placeholder="Sélectionnez une école"
                className={`${errors.ecole ? "border-red-500" : ""} text-black`}
              />
              {errors.ecole && (
                <p className="text-red-500 text-sm mt-1">Ce champ est obligatoire</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'utilisateur <span className="text-red-500">*</span>
              </label>
              <Select
                options={UTILISATEURS}
                value={formData.utilisateur}
                onChange={(e) => handleInputChange("utilisateur", e.target.value)}
                placeholder="Sélectionnez un type d'utilisateur"
                className={`${errors.utilisateur ? "border-red-500" : ""} text-black`}
              />
              {errors.utilisateur && (
                <p className="text-red-500 text-sm mt-1">Ce champ est obligatoire</p>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-accent text-white rounded-md hover:bg-[#574e7c] transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Résoudre la demande
              </button>
            </div>
          </div>
        </Card>
      </form>

      {/* Modal de succès */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold strong-blue mb-2">Demande résolue avec succès !</h3>
              <p className="text-gray-600 mb-6">
                La réponse a été enregistrée et la demande d'aide a été marquée comme résolue.
              </p>
              <button
                onClick={handleReturnToAdmin}
                className="w-full px-6 py-3 bg-purple-accent text-white rounded-lg hover:opacity-90 transition-colors font-medium"
              >
                Retour à l'administration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminFormPage() {
  return (
    <Suspense fallback={<div className="mx-auto px-4 py-8">Chargement...</div>}>
      <AdminFormContent />
    </Suspense>
  );
}
