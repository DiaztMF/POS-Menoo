import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
    title: string;
    value: string;
    subtitle?: string;
    icon: LucideIcon;
    accentColor?: string;
};

export function StatCard({ title, value, subtitle, icon: Icon, accentColor = 'text-primary' }: Props) {
    return (
        <Card className="border-border/70 bg-card shadow-xs">
            <CardContent className="p-3.5 sm:p-4">
                <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                        {title}
                    </p>
                    <div className={`p-1.5 rounded-md bg-muted/60 ${accentColor}`}>
                        <Icon className="size-3.5" />
                    </div>
                </div>
                <div className="mt-1">
                    <h3 className="text-xl font-bold tracking-tight text-foreground leading-tight">{value}</h3>
                    {subtitle && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                            {subtitle}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
