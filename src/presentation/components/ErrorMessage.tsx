/**
 * Error message component with Tailwind styling.
 */

import { Button } from './Button';

interface ErrorMessageProps {
    error: Error;
    onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
    const isPermissionError = error.message.includes('microphone') || error.message.includes('permission');

    return (
        <div className="bg-gradient-to-br from-red-50/90 to-red-100/90 border-2 border-red-300/40 rounded-2xl p-4 text-red-600 font-semibold shadow-sm backdrop-blur-lg">
            <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                    <p className="font-bold mb-1">
                        {isPermissionError ? 'Microphone Access Required' : 'Error'}
                    </p>
                    <p className="text-sm opacity-90">
                        {error.message}
                    </p>
                    {onRetry && (
                        <div className="mt-3">
                            <Button onClick={onRetry} variant="secondary">
                                Try Again
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
