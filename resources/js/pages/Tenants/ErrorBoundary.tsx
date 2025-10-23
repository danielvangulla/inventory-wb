// resources/js/Components/ErrorBoundary.tsx
import React, { Component, ErrorInfo } from 'react';

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<React.PropsWithChildren<Record<string, unknown>>, State> {
    constructor(props: React.PropsWithChildren<Record<string, unknown>>) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can log the error to an error reporting service
        console.log('ErrorBoundary caught an error', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return <h1>Something went wrong. Please try again.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
