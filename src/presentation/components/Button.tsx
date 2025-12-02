/**
 * Simple, reusable button component with Tailwind styling.
 * Pure presentation - no business logic.
 */

import type { ReactNode } from 'react';

interface ButtonProps {
    onClick: () => void;
    children: ReactNode;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}

export function Button({ onClick, children, variant = 'primary', disabled = false }: ButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xl font-bold uppercase tracking-wide cursor-pointer transition-all duration-300 relative overflow-hidden outline-none select-none min-w-[200px] disabled:opacity-60 disabled:cursor-not-allowed shadow-[inset_0_1px_0_hsla(0,0%,100%,0.5),inset_0_-2px_0_hsla(0,0%,0%,0.15),0_8px_16px_hsla(0,0%,0%,0.2),0_4px_8px_hsla(0,0%,0%,0.1)] hover:not(:disabled):-translate-y-0.5 hover:not(:disabled):shadow-[inset_0_1px_0_hsla(0,0%,100%,0.5),inset_0_-2px_0_hsla(0,0%,0%,0.15),0_12px_24px_hsla(0,0%,0%,0.25),0_6px_12px_hsla(0,0%,0%,0.15)] active:not(:disabled):translate-y-0 active:not(:disabled):shadow-[inset_0_2px_4px_hsla(0,0%,0%,0.2),0_2px_4px_hsla(0,0%,0%,0.1)]';

    const variantClasses = variant === 'primary'
        ? 'text-white'
        : 'text-white';

    return (
        <button
            className={`${baseClasses} ${variantClasses}`}
            onClick={onClick}
            disabled={disabled}
            style={{
                background: variant === 'primary' ? 'var(--gradient-button-blue)' : 'var(--gradient-button-green)',
                textShadow: '0 1px 2px hsla(0, 0%, 0%, 0.3)'
            }}
        >
            <span className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full pointer-events-none" />
            {children}
        </button>
    );
}
