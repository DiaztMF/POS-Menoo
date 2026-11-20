import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/favicon.ico"
            alt="TeFa POS logo"
            className="size-full object-contain"
            {...props}
        />
    );
}
