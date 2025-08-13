import { useState, useEffect } from "react";

/**
 * Custom hook for managing filter state with URL synchronization
 * Handles reading filter from URL params on load and updating URL when filter changes
 */
export function useUrlFilter() {
    const [selectedFilter, setSelectedFilter] = useState("most-recent");

    // Initialize filter from URL on page load
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');

        if (filterParam) {
            setSelectedFilter(filterParam);
        }
    }, []);

    // Update URL when filter changes
    useEffect(() => {
        const url = new URL(window.location.href);

        if (selectedFilter && selectedFilter !== "most-recent") {
            url.searchParams.set('filter', selectedFilter);
        } else {
            url.searchParams.delete('filter');
        }

        window.history.replaceState(null, '', url.toString());
    }, [selectedFilter]);

    return [selectedFilter, setSelectedFilter] as const;
}
