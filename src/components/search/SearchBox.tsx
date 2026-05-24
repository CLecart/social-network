"use client";
import React, { useEffect } from "react";
import ResultsList from "./Result";
import { addToSearchHistory } from "@/lib/utils/searchHistory";
import { useSearch } from "@/hooks/use-search";

interface SearchBoxProps {
    query: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ query }) => {
    const { results, isLoading, debouncedQuery } = useSearch(query, 300);

    useEffect(() => {
        if (debouncedQuery && results.length > 0) {
            addToSearchHistory(debouncedQuery);
        }
    }, [debouncedQuery, results]);

    // TODO : Remove le Any
    return (
        <div className="space-y-4">
            {isLoading ? (
                <div className="text-sm text-[var(--textMinimal)] text-center">Chargement…</div>
            ) : (
                <ResultsList query={query} results={results as any} />
            )}
        </div>
    );
};

export default SearchBox;
