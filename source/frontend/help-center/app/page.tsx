'use client';

import { useState } from 'react';
import DropdownCard from "../components/DropdownCard";
import ListCard from "../components/ListCard";
import { Youtube, FileMinus } from 'lucide-react';
import SearchResponseComponent from "@/components/SearchCard";
import Chip from "@/components/Chip";
import WaitingSection from "@/components/WaitingSection";
import HelpAIModal from "@/components/HelpAIModal";
import { mockThemes } from "@/utils/constants/mockTheme";

export default function Home() {
  const [isHelpAIModalOpen, setIsHelpAIModalOpen] = useState(false);

  const handleOpenHelpAI = () => {
    console.log('Ouverture de la modal HelpAI depuis Page');
    setIsHelpAIModalOpen(true);
  };

  const handleCloseHelpAI = () => {
    setIsHelpAIModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SearchResponseComponent onOpenHelpAI={handleOpenHelpAI} />
        </div>
        <div className="lg:col-span-1 flex flex-col">
          <h1 className="font-bold text-xl strong-blue mb-4">Thématiques</h1>
          <div className="flex flex-wrap gap-2">
            {mockThemes.map((theme) => (
              <Chip 
                key={theme.id}
                title={theme.label}
              />
            ))}
          </div>
        </div>
      </div>

      <WaitingSection/>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <DropdownCard
          title="Questions épinglées"
          questions={[
            "Comment se rendre aux différents campus ?",
            "Quelles sont les aires et jours d'ouverture de la salle de sport ?"
          ]}
        />

        <ListCard
          title="Vidéos épinglées"
          items={[
            {
              icon: Youtube,
              text: "Panorama des outils digitaux",
              href: "/videos/panorama"
            },
            {
              icon: Youtube,
              text: "Bienvenue à l'ESILV !",
              href: "/videos/esilv"
            },
            {
              icon: Youtube,
              text: "Bienvenue à l'EMLV !",
              href: "/videos/emlv"
            }
          ]}
        />

        <ListCard
          title="Tutoriels épinglés"
          items={[
            {
              icon: FileMinus,
              text: "Comment faire une capture d'écran complète ?",
              href: "/tutoriels/capture-ecran"
            },
            {
              icon: FileMinus,
              text: "Comment vider son cache ?",
              href: "/tutoriels/vider-cache"
            },
            {
              icon: FileMinus,
              text: "Comment créer une convention de stage",
              href: "/tutoriels/convention-stage"
            }
          ]}
        />
      </div>

      {/* Modal HelpAI */}
      <HelpAIModal
        isOpen={isHelpAIModalOpen} 
        onClose={handleCloseHelpAI} 
      />
    </div>
  );
}
