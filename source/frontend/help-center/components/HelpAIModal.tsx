import React from 'react';
import { ChatBot } from './Chat';

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
  >
    <ChatBot />
  </div>
</div>
  );
};

export default HelpAIModal;