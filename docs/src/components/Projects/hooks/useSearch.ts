import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook for managing search functionality
 * Handles search input, clear functionality, focus management, and keyboard shortcuts
 */
export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus on search input on page load
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Handle escape key to clear search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && searchTerm) {
        handleClearSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    searchInputRef,
    handleClearSearch
  };
}
