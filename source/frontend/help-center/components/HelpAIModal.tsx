import React from 'react';
import { ChatBot } from './Chat';
import { X } from 'lucide-react';

interface HelpAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpAIModal: React.FC<HelpAIModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
  className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50"
  onClick={handleOverlayClick}
>
  <div
    onClick={(e) => e.stopPropagation()}
    className="relative w-[800px] h-[600px] bg-white rounded-xl border border-gray-200"
    style={{
      boxShadow: '0px 0px 20px 0px rgba(76, 87, 125, 0.02)'
    }}
  >
    <button
      onClick={onClose}
      className="absolute cursor-pointer top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-purple-accent transition-colors border border-gray-200"
      aria-label="Fermer"
    >
      <X className="w-5 h-5 strong-blue" />
    </button>
    
    <div className="w-full h-full p-6 flex flex-col">
      <ChatBot />
    </div>
  </div>
</div>
  );
};

export default HelpAIModal;