export interface Theme {
  id: string;
  label: string;
}

export const mockThemes: Theme[] = [
  { id: 'rh-daf', label: 'RH et DAF' },
  { id: 'outils-numeriques', label: 'Outils numériques' },
  { id: 'scolarite', label: 'Scolarité' },
  { id: 'vie-etudiante', label: 'Vie étudiante' },
  { id: 'de-vinci-learning', label: 'De Vinci Learning' },
  { id: 'international', label: 'International' },
  { id: 'stages', label: 'Stages' },
  { id: 'alternance', label: 'Alternance' },
  { id: 'langues', label: 'Langues' },
  { id: 'app-mobile', label: 'App Mobile' },
  { id: 'soft-skills', label: 'Soft Skills' },
];