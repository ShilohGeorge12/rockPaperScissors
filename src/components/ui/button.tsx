import { cn } from '../../lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]";

    const sizeClasses = {
      default: "h-11 px-6 py-2 text-sm",
      sm: "h-9 px-4 text-xs",
      lg: "h-12 px-8 text-base",
    };

    const getVariantStyle = (): React.CSSProperties => {
      switch (variant) {
        case "default":
          return { background: "var(--accent-primary)", color: "#fff" };
        case "destructive":
          return { background: "#ef4444", color: "#fff" };
        case "outline":
          return { background: "transparent", border: "1px solid var(--border-glass)", color: "var(--text-primary)" };
        case "ghost":
          return { background: "transparent", color: "var(--text-primary)" };
      }
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, sizeClasses[size], className)}
        style={getVariantStyle()}
        {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
export type { ButtonProps };