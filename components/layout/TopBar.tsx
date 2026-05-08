'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  showBack?: boolean;
  title?: string;
  subtitle?: string;
  prevHref?: string;
  nextHref?: string;
}

export function TopBar({ showBack = false, title, subtitle, prevHref, nextHref }: TopBarProps) {
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

        {(prevHref || nextHref) ? (
          <div className="flex gap-1">
            {prevHref ? (
              <Link href={prevHref} className="p-2 hover:bg-surface rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-primary" />
              </Link>
            ) : (
              <div className="p-2" />
            )}
            {nextHref ? (
              <Link href={nextHref} className="p-2 hover:bg-surface rounded-lg transition-colors">
                <ArrowRight className="w-5 h-5 text-primary" />
              </Link>
            ) : (
              <div className="p-2" />
            )}
          </div>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </div>
  );
}
