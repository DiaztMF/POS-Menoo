import type { Auth } from '@/types/auth';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: SharedData;
    }
}

declare module '@inertiajs/react' {
    export interface PageProps extends SharedData {}
}
