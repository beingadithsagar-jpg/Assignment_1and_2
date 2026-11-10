import React, { Component, type ComponentProps, type ErrorInfo, type ReactNode } from 'react';

export const Surface = ({
  inset = false,
  className = '',
  ...props
}: ComponentProps<'div'> & { inset?: boolean }) => (
  <div
    className={`min-w-0 rounded-card text-foreground ${
      inset
        ? 'border border-border/40 bg-background'
        : 'border border-border/35 bg-surface shadow-surface'
    } ${className}`}
    {...props}
  />
);

const buttonTones = {
  primary: 'bg-primary text-primary-foreground hover:brightness-95',
  quiet: 'border border-border/50 bg-surface text-foreground hover:bg-background',
  ghost: 'bg-transparent text-foreground hover:bg-background',
  danger: 'border border-danger/45 bg-surface text-danger hover:bg-danger/5',
};

export const Button = ({
  tone = 'primary',
  type = 'button',
  className = '',
  ...props
}: ComponentProps<'button'> & { tone?: keyof typeof buttonTones }) => (
  <button
    type={type}
    className={`inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-control px-4 text-label font-medium transition-colors active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${buttonTones[tone]} ${className}`}
    {...props}
  />
);

export const Field = ({
  id,
  label,
  hint,
  meta,
  children,
  className = '',
}: {
  id: string;
  label: string;
  hint?: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <label htmlFor={id} className="text-label font-medium text-foreground">
        {label}
      </label>
      {meta && <span className="text-caption text-muted tabular-nums">{meta}</span>}
    </div>
    {hint && <p className="text-caption text-muted">{hint}</p>}
    {children}
  </div>
);

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected rendering error occurred.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-background p-6">
          <Surface className="w-full max-w-lg p-6">
            <div role="alert" className="space-y-4">
              <h1 className="text-title text-foreground">Workspace interrupted</h1>
              <p className="text-body text-muted">{this.state.errorMessage}</p>
              <Button
                tone="primary"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Reload workspace
              </Button>
            </div>
          </Surface>
        </div>
      );
    }
    return this.props.children;
  }
}
