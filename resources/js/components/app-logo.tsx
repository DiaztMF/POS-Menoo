export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg">
                <img
                    src="/menoo-icon.svg"
                    alt="Menoo Icon"
                    width={32}
                    height={32}
                    className="object-cover"
                />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Menoo
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    POS & Operations
                </span>
            </div>
        </>
    );
}