'use client';

import { useState } from 'react';
import Card from './utils/Card';
import { ChevronDown } from 'lucide-react';

interface DropdownCardProps {
  title: string;
  questions: string[];
  color?: string;
}

export default function DropdownCard({ 
  title, 
  questions, 
  color = 'bg-white'
}: DropdownCardProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Card color={color}>
      {/* Titre principal */}
      <h2 className="strong-blue text-xl font-semibold mb-3">{title}</h2>
      
      {/* Liste des questions avec accordion */}
      <div className="space-y-0">
        {questions.map((question, index) => (
          <div key={index} className="py-0">
            {/* Header cliquable */}
            <div 
              className="flex items-center justify-between w-full py-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleAccordion(index)}
            >
              <div className="flex-1">
                <div className="text-gray-800 font-medium text-base">
                  {question}
                </div>
              </div>
              <div className="ml-4">
                <ChevronDown />
              </div>
            </div>

            {/* Contenu expandable */}
            {openItems.includes(index) && (
              <div className="pb-4">
                <div className="text-gray-700 leading-relaxed">
                  <p className="mt-2 text-sm">
                    Campus du Pôle Léonard de Vinci : 12 Avenue Léonard de Vinci, 92400 Courbevoie
                  </p>
                </div>
                
                {/* Métadonnées comme dans l'exemple */}
                <div className="flex items-center flex-wrap gap-2 mt-4 text-sm text-gray-600">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    ESILV
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    EMLV
                  </span>
                  <span className="mx-1">|</span>
                  <span>Mis à jour le {new Date().toLocaleDateString('fr-FR')}</span>
                  <span>|</span>
                  <button className="text-gray-600 hover:text-blue-600 transition-colors">
                    <i className="fa-solid fa-share"></i>
                  </button>
                  <span>|</span>
                  <button className="text-gray-600 hover:text-blue-600 transition-colors">
                    <i className="fa-solid fa-hashtag"></i>
                  </button>
                </div>
                
                {/* Séparateur */}
                {index < questions.length - 1 && (
                  <hr className="border-gray-200 mt-4" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
