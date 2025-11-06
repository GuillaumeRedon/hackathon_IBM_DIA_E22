import { 
  Sparkles, 
  Search, 
  LucideIcon, 
  FileMinus, 
  User, 
  Book, 
  Settings, 
  CreditCard, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Lock, 
  Users, 
  GraduationCap,
  FileText,
  HelpCircle,
  Video,
  Download
} from "lucide-react";

export interface SearchSuggestion {
  id: string;
  label: string;
  icon: LucideIcon;
  special?: boolean;
  category?: string;
}

export const searchSuggestions: SearchSuggestion[] = [
  // Suggestion spéciale IA
  { id: 'help-ai', label: 'Demander à HelpAI', icon: Sparkles, special: true },
  
  { id: 'password-reset', label: 'Comment réinitialiser mon mot de passe ?', icon: Search },
  { id: 'profile-edit', label: 'Comment modifier mes informations personnelles ?', icon: Search },
  { id: 'login-issues', label: 'Je ne parviens pas à me connecter', icon: Search },
  
  { id: 'grades', label: 'Où puis-je consulter mes notes ?', icon: FileMinus },
  { id: 'schedule', label: 'Comment accéder à mon emploi du temps ?', icon: FileMinus },
  { id: 'courses', label: 'Où trouver mes cours en ligne ?', icon: FileMinus },
  { id: 'absences', label: 'Comment justifier une absence ?', icon: FileMinus },
  
  { id: 'campus-location', label: 'Comment se rendre aux différents campus ?', icon: Search },
  { id: 'gym-hours', label: 'Quels sont les horaires de la salle de sport ?', icon: Search },
  { id: 'parking', label: 'Où puis-je me garer sur le campus ?', icon: Search },
  { id: 'library', label: 'Comment accéder à la bibliothèque ?', icon: Search },
  
  { id: 'wifi-issues', label: 'Problème de connexion WiFi', icon: Search },
  { id: 'software-install', label: 'Comment installer les logiciels requis ?', icon: FileMinus },
  { id: 'email-config', label: 'Comment configurer mon email étudiant ?', icon: FileMinus },
  { id: 'platform-access', label: 'Je ne peux pas accéder à la plateforme', icon: Search },
  
  { id: 'tuition-payment', label: 'Comment payer mes frais de scolarité ?', icon: FileMinus },
  { id: 'scholarship', label: 'Comment faire une demande de bourse ?', icon: FileMinus },
  { id: 'invoice', label: 'Où trouver mes factures ?', icon: FileMinus },
  
  { id: 'emergency', label: 'Numéros d\'urgence sur le campus', icon: Search },
  { id: 'lost-card', label: 'J\'ai perdu ma carte étudiante', icon: FileMinus },
  { id: 'technical-support', label: 'Contacter le support technique', icon: Search },
];