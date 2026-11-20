import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/menoo-icon.svg"
            alt="Menoo logo"
            className="size-full object-contain"
            {...props}
        />
    );
}

