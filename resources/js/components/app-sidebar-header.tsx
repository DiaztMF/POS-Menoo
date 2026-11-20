import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/react';

const defaultTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/pos': 'Kasir POS',
    '/laporan': 'Laporan Penjualan',
    '/menu': 'Kelola Menu',
};

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { url } = usePage();
    const path = url.split('?')[0];

    const resolvedBreadcrumbs: BreadcrumbItemType[] =
        breadcrumbs.length > 0
            ? breadcrumbs
            : defaultTitles[path]
            ? [{ title: defaultTitles[path], href: path }]
            : [{ title: 'Dashboard', href: '/dashboard' }];

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={resolvedBreadcrumbs} />
            </div>
        </header>
    );
}
