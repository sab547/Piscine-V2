'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="sticky top-12 bg-white border-b border-border px-4 py-3 z-30">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-text-muted font-semibold">
          <span>Étape {currentStep + 1}/{totalSteps}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
