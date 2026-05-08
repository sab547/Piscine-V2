'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  showBack?: boolean;
  title?: string;
  subtitle?: string;
}

export function TopBar({ showBack = false, title, subtitle }: TopBarProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 safe-area">
        {showBack ? (
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-surface rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
        ) : (
          <div />
        )}

        <div className="flex-1 flex flex-col items-center">
          {title && (
            <h1 className="text-lg font-semibold text-text font-display">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-text-muted font-body mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="w-10" />
      </div>
    </div>
  );
}
