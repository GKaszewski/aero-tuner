/**
 *Status indicator component.
 */

interface StatusIndicatorProps {
    status: 'listening' | 'idle' | 'error';
}

const statusConfig = {
    listening: {
        label: 'Listening...',
        dotClass: 'animate-pulse',
        dotStyle: { background: 'var(--color-success)', boxShadow: '0 0 10px var(--color-success)' }
    },
    idle: {
        label: 'Ready',
        dotClass: '',
        dotStyle: { background: 'hsl(210, 15%, 70%)' }
    },
    error: {
        label: 'Error',
        dotClass: '',
        dotStyle: { background: 'var(--color-error)' }
    }
};

export function StatusIndicator({ status }: StatusIndicatorProps) {
    const config = statusConfig[status];

    return (
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold bg-white/30 backdrop-blur-md">
            <div className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} style={config.dotStyle} />
            <span>{config.label}</span>
        </div>
    );
}
