"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/utils/Card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";

const LANGUES = ["Français", "English"];
const ECOLES = ["ESILV", "EMLV", "EXECUTIVE", "IIM"];
const UTILISATEURS = ["faculty", "staff", "student"];

function AdminFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    question: "",
    reponse: "",
    langue: "",
    ecole: "",
    utilisateur: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const questionParam = searchParams.get("question");
    if (questionParam) {
      setFormData((prev) => ({
        ...prev,
        question: decodeURIComponent(questionParam),
      }));
    }
  }, [searchParams]);

  const handleInputChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Ici, vous pouvez ajouter la logique pour sauvegarder les données
      console.log("Formulaire soumis:", formData);
      alert("Réponse enregistrée avec succès !");
      router.push("/admin");
    }
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
        <h1 className="text-3xl font-bold mb-2 text-black">Répondre à la question</h1>
        <p className="text-gray-600">
          Remplissez tous les champs obligatoires pour publier la réponse
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="py-4 space-y-6">
            {/* Question */}
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

            {/* Réponse */}
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

            {/* Langue */}
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

            {/* École */}
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

            {/* Utilisateur */}
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

            {/* Buttons */}
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
                Enregistrer la réponse
              </button>
            </div>
          </div>
        </Card>
      </form>
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
