'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = ['Accueil', 'Mesures', 'Produits', 'Photos', 'Rapport', 'Envoi'];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = ((currentStep + 1) / totalSteps) * 100;
  const label = STEP_LABELS[currentStep] ?? `Étape ${currentStep + 1}`;

  return (
    <div className="sticky top-12 bg-white/95 backdrop-blur-sm border-b border-border/70 px-4 py-3 z-30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-primary font-mono">
            {currentStep + 1}/{totalSteps}
          </span>
          <span className="text-xs font-semibold text-text">{label}</span>
        </div>
        <span className="text-xs font-bold text-text-muted">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-border/50 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {/* Step dots */}
      <div className="flex justify-between mt-2 px-0.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i <= currentStep ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
