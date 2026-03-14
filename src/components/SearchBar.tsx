import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchLocations } from '../api';
import { Location } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SearchBarProps {
  onSelectLocation: (location: Location) => void;
  currentLocationName?: string;
}

export function SearchBar({ onSelectLocation, currentLocationName }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      const data = await searchLocations(query);
      setResults(data);
      setIsSearching(false);
      setIsOpen(true);
    };

    const debounceTimer = setTimeout(fetchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto z-50">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-white/50">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={currentLocationName || "Search for a city..."}
          className="w-full bg-white/10 border border-white/10 text-white placeholder-white/50 rounded-full py-3 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all backdrop-blur-md"
        />
        {isSearching && (
          <div className="absolute right-4 text-white/50">
            <Loader2 size={18} className="animate-spin" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 glass-panel-search rounded-2xl overflow-hidden shadow-2xl"
          >
            <ul className="max-h-60 overflow-y-auto py-2">
              {results.map((location) => (
                <li key={location.id}>
                  <button
                    onClick={() => {
                      onSelectLocation(location);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-white/10 transition-colors flex items-center gap-3 group"
                  >
                    <MapPin size={16} className="text-white/40 group-hover:text-white/80 transition-colors" />
                    <div>
                      <div className="text-white font-medium">{location.name}</div>
                      <div className="text-white/50 text-xs">
                        {[location.admin1, location.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
