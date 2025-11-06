"use client";

import Card from './utils/Card';

export default function WaitingSection() {
  const handleOpenRequest = () => {
    console.log('Ouvrir une demande d\'aide');
  };

  const handleViewAllRequests = () => {
    console.log('Voir toutes les demandes');
  };

  return (
    <div className="w-full">
      <Card>
        {/* Header avec titre et bouton */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="strong-blue text-xl font-semibold">
            Demandes d'aide en cours
          </h2>
          <button
            onClick={handleOpenRequest}
            className="bg-purple-accent text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Ouvrir une demande d'aide
          </button>
        </div>

        <div className="text-center mt-3">
          <span className="text-gray-600">
            Aucune demande d'aide en cours
          </span>
        </div>

        <div className="mt-4">
          <button
            onClick={handleViewAllRequests}
            className="purple-accent transition-colors text-sm"
          >
            Voir toutes les demandes
          </button>
        </div>
      </Card>
    </div>
  );
}
