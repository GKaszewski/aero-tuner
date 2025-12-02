import { StatusIndicator } from "./StatusIndicator";

interface HeaderProps {
    status: 'idle' | 'listening' | 'error';
}

export default function Header({ status }: HeaderProps) {
    return <div
        className="px-8 py-5 shadow-[inset_0_2px_0_hsla(0,0%,100%,0.4),inset_0_-2px_0_hsla(0,0%,0%,0.1),0_4px_16px_hsla(200,70%,20%,0.2)] flex items-center justify-between"
        style={{ background: 'var(--gradient-header)' }}
    >
        <div className="flex items-center gap-4 text-4xl font-extrabold text-white drop-shadow-[0_2px_0_hsla(0,0%,0%,0.2)] md:text-3xl max-md:text-2xl">
            <span className="text-5xl drop-shadow-[0_2px_4px_hsla(0,0%,0%,0.2)] md:text-4xl max-md:text-2xl">🌍</span>
            Tuner
        </div>
        <StatusIndicator status={status} />
    </div>;
}