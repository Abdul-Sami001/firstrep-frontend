export interface CursorPage<T> {
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface CursorState<T> {
    items: T[];
    nextCursor: string | null;
    previousCursor: string | null;
}

// Extracts cursor token from DRF-style next/previous URLs
export const extractCursor = (url?: string | null): string | null => {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        return parsed.searchParams.get('cursor');
    } catch {
        return null;
    }
};

// Merges pages and returns flat list with latest cursor references
export const mergeCursorPages = <T>(pages: CursorPage<T>[]): CursorState<T> => {
    const items = pages.flatMap((page) => page?.results || []);
    const lastPage = pages[pages.length - 1];

    return {
        items,
        nextCursor: extractCursor(lastPage?.next),
        previousCursor: extractCursor(lastPage?.previous),
    };
};
