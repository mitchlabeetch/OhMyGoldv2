import type { ElementType, ReactNode } from "react";

type EmptyStateProps = {
  icon?: ElementType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action, children }: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-label={title}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-text-muted" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-text-secondary text-sm max-w-xs">{description}</p>}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-6 px-4 py-2 bg-gold-400 text-black text-sm font-semibold rounded-lg hover:bg-gold-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400/50"
        >
          {action.label}
        </button>
      )}
      {children}
    </div>
  );
}
