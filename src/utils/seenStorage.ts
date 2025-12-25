// src/utils/seenStorage.ts
const SEEN_KEY = "seenPendingOrders_v1";

export const readSeenIds = (): number[] => {
    try {
        const raw = localStorage.getItem(SEEN_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch {
        return [];
    }
};

export const writeSeenIds = (ids: number[]) => {
    try {
        localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
    } catch { }
};
