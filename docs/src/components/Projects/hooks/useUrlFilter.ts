import { useState, useEffect } from "react";

/**
 * Custom hook for managing filter state with URL synchronization
 * Handles reading filter from URL params on load and updating URL when filter changes
 */
export function useUrlFilter() {
    const [selectedFilter, setSelectedFilter] = useState("most-recent");

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        
        if (filterParam) {
            setSelectedFilter(filterParam);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const searchParams = new URLSearchParams(window.location.search);
        
        if (selectedFilter && selectedFilter !== "most-recent") {
            searchParams.set('filter', selectedFilter);
        } else {
            searchParams.delete('filter');
        }
        
        const newSearch = searchParams.toString();
        const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
        
        window.history.replaceState(null, '', newUrl);
    }, [selectedFilter]);

    return [selectedFilter, setSelectedFilter] as const;
}
