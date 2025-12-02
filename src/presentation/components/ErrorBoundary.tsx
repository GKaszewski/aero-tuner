import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-50 p-4">
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50 max-w-md w-full text-center">
                        <div className="text-4xl mb-4">😵</div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h1>
                        <p className="text-gray-600 mb-6">
                            The tuner crashed. This might be due to a temporary glitch.
                        </p>
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-mono mb-6 text-left overflow-auto max-h-32">
                            {this.state.error?.message}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-gradient-to-b from-blue-400 to-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all"
                        >
                            Reload App
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
