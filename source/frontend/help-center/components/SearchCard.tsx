"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Card from './utils/Card';
import { searchSuggestions } from '@/utils/constants/mockSearch';

interface SearchResponseComponentProps {
  onOpenHelpAI?: () => void;
}

export default function SearchResponseComponent({ onOpenHelpAI }: SearchResponseComponentProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.id === 'help-ai' || 
    suggestion.label.toLowerCase().includes(searchValue.toLowerCase())
  ).sort((a, b) => {
    if (a.id === 'help-ai') return -1;
    if (b.id === 'help-ai') return 1;
    return 0;
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenHelpAI = () => {
    if (onOpenHelpAI) {
      onOpenHelpAI();
    } else {
      console.log('Ouverture de la modal HelpAI');
    }
    setOpen(false);
    setSelectedIndex(0);
  };

  const handleSelect = (suggestionId: string) => {
    const suggestion = filteredSuggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      if (suggestion.id === 'help-ai') {
        handleOpenHelpAI();
      } else {
        console.log('Selected:', suggestion.label);
        setSearchValue(suggestion.label);
        setOpen(false);
        setSelectedIndex(0);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSuggestions[selectedIndex]) {
        handleSelect(filteredSuggestions[selectedIndex].id);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchValue]);

  return (
    <Card color='bg-strong-blue'>
      <h1 className="text-lg font-bold text-white text-left py-4">
        Rechercher votre réponse
      </h1>

      <div className="pb-4 relative" ref={wrapperRef}>
        <InputGroup className='bg-white h-12'>
          <InputGroupInput
            placeholder="Tapez votre question..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className="pr-12"
          />
          <InputGroupAddon>
            <Search className="h-5 w-5 text-slate-400" />
          </InputGroupAddon>
        </InputGroup>

        {open && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Suggestions ({filteredSuggestions.length})
              </div>
              <div className="max-h-80 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSelect(suggestion.id)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full cursor-pointer flex items-center px-4 py-3 text-left transition-colors ${
                        suggestion.special
                          ? 'bg-linear-to-r from-violet-50 to-purple-50 border-l-4 border-violet-500 mx-1 rounded-r-md'
                          : index === selectedIndex
                          ? 'bg-gray-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <Icon
                        className={`mr-3 h-5 w-5 shrink-0 ${
                          suggestion.special ? 'text-violet-600' : 'text-slate-400'
                        }`}
                      />
                      <span
                        className={`${
                          suggestion.special
                            ? 'font-semibold text-violet-900'
                            : 'text-gray-700'
                        }`}
                      >
                        {suggestion.label}
                      </span>
                      {suggestion.category && (
                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {suggestion.category}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {open && filteredSuggestions.length === 0 && searchValue.trim() !== '' && (
          <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Aucun résultat trouvé pour "{searchValue}"
            </div>
          </div>
        )}
      </div>

      <div className="text-left py-6">
        <h2 className="text-md font-semibold text-white">
          Je ne trouve pas ma réponse
        </h2>
        <button
          onClick={handleOpenHelpAI}
          className="text-white underline hover:text-violet-300 transition-colors text-sm"
        >
          Ouvrir une demande d'aide
        </button>
      </div>
    </Card>
  );
}