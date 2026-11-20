import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import type { SharedData } from '@/types';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Menoo" />
            <div className="flex min-h-screen flex-col items-center bg-background p-6 text-foreground lg:justify-center lg:p-8">
                <header className="mb-6 w-full max-w-sm text-sm lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-3">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-md border border-border px-5 py-2 text-sm font-medium hover:bg-accent"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-md border border-border px-5 py-2 text-sm font-medium hover:bg-accent"
                                >
                                    Masuk
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center lg:grow">
                    <main className="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 p-6 lg:p-12">
                            <div className="mb-6 flex items-center gap-3">
                                <img src="/menoo-icon.svg" alt="Menoo" className="size-10" />
                                <span className="text-2xl font-bold tracking-tight">Menoo</span>
                            </div>
                            <h1 className="mb-2 text-lg font-semibold">
                                Selamat datang di Menoo
                            </h1>
                            <p className="mb-6 text-sm text-muted-foreground">
                                Sistem kasir kantin dengan laporan penjualan harian.
                            </p>
                            <ul className="mb-8 space-y-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <span className="size-1.5 rounded-full bg-primary" />
                                    Kasir mobile-first untuk makanan dan minuman
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="size-1.5 rounded-full bg-primary" />
                                    Laporan total penjualan per hari
                                </li>
                            </ul>
                            <Link
                                href={login()}
                                className="inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                Mulai Kasir
                            </Link>
                        </div>
                        <div className="hidden shrink-0 items-center justify-center bg-muted p-8 lg:flex lg:w-[400px]">
                            <img
                                src="/menoo-navbar-icon.svg"
                                alt="Menoo logo"
                                className="w-full max-w-xs"
                            />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}