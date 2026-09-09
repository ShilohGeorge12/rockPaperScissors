import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/button';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className='flex flex-col items-center justify-center w-full min-h-screen p-8' style={{ background: 'var(--bg-primary)' }}>
          <div className='max-w-md text-center glass-strong rounded-2xl p-8' style={{ border: '1px solid var(--border-glass)' }}>
            <p className='text-6xl mb-4'>Something went wrong</p>
            <h1 className='text-3xl font-display font-bold mb-4' style={{ color: 'var(--text-primary)' }}>Unexpected Error</h1>
            <p className='mb-6' style={{ color: 'var(--text-secondary)' }}>
              The game hit an unexpected error. You can try again.
            </p>
            {this.state.error && (
              <details className='mb-6 text-left glass rounded-xl p-4'>
                <summary className='cursor-pointer text-sm' style={{ color: 'var(--text-muted)' }}>Error details</summary>
                <pre className='mt-2 text-xs whitespace-pre-wrap break-words' style={{ color: '#ff6b6b' }}>{this.state.error.message}</pre>
              </details>
            )}
            <Button onClick={this.handleReset}>Try Again</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
