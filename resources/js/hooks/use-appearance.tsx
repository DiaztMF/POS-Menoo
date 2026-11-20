export type ResolvedAppearance = 'light' | 'dark';
export type Appearance = ResolvedAppearance | 'system';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

/**
 * Dark mode removed: the app is light-only. Keep the hook surface so
 * consumers (sonner, two-factor modal) compile unchanged.
 */
export function initializeTheme(): void {
    if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark');
    }
}

export function useAppearance(): UseAppearanceReturn {
    return {
        appearance: 'light',
        resolvedAppearance: 'light',
        updateAppearance: () => {},
    };
}