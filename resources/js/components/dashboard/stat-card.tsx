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
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {title}
                    </p>
                    <div className={`p-2 rounded-lg bg-muted/60 ${accentColor}`}>
                        <Icon className="size-4" />
                    </div>
                </div>
                <div className="mt-2">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            {subtitle}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
