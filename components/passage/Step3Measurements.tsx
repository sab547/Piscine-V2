'use client';

import { mockNormes } from '@/lib/mock-data';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface MeasurementData {
  ph: number | '';
  chlore: number | '';
  temperature: number | '';
}

interface Step3MeasurementsProps {
  data: MeasurementData;
  onChange: (data: MeasurementData) => void;
}

function MeasurementInput({
  label,
  icon,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  icon: string;
  value: number | '';
  min: number;
  max: number;
  unit: string;
  onChange: (v: number | '') => void;
}) {
  const isValid = value === '' || (value >= min && value <= max);
  const isFilled = value !== '';

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-text">{label}</label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
          {icon}
        </div>
        <input
          type="number"
          step={label === 'pH' ? '0.1' : '1'}
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === '' ? '' : parseFloat(v));
          }}
          className="w-full pl-16 pr-12 py-3 bg-white border-2 rounded-lg font-mono text-lg font-semibold focus:outline-none transition-colors"
          style={{
            borderColor: !isFilled ? '#E2E8F0' : isValid ? '#10B981' : '#EF4444',
          }}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isFilled &&
            (isValid ? (
              <CheckCircle2 className="w-6 h-6 text-success" />
            ) : (
              <AlertCircle className="w-6 h-6 text-danger" />
            ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">
          Norme : {min}–{max} {unit}
        </span>
        {isFilled && !isValid && (
          <span className="text-danger font-semibold">⚠ Hors norme</span>
        )}
        {isFilled && isValid && (
          <span className="text-success font-semibold">✓ OK</span>
        )}
      </div>
    </div>
  );
}

export function Step3Measurements({
  data,
  onChange,
}: Step3MeasurementsProps) {
  const handleChange = (field: keyof MeasurementData, value: number | '') => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold text-text font-display">
        Mesures de l'eau
      </h2>

      <div className="space-y-6">
        <MeasurementInput
          label="pH"
          icon="💧"
          value={data.ph}
          min={mockNormes.ph.min}
          max={mockNormes.ph.max}
          unit={mockNormes.ph.unite}
          onChange={(v) => handleChange('ph', v)}
        />

        <MeasurementInput
          label="Chlore (ppm)"
          icon="🧪"
          value={data.chlore}
          min={mockNormes.chlore.min}
          max={mockNormes.chlore.max}
          unit={mockNormes.chlore.unite}
          onChange={(v) => handleChange('chlore', v)}
        />

        <MeasurementInput
          label="Température (°C)"
          icon="🌡️"
          value={data.temperature}
          min={mockNormes.temperature.min}
          max={mockNormes.temperature.max}
          unit={mockNormes.temperature.unite}
          onChange={(v) => handleChange('temperature', v)}
        />
      </div>

      <div className="bg-accent/10 border border-accent rounded-lg p-4">
        <p className="text-xs text-text-muted">
          <span className="font-semibold text-accent">💡 Conseil :</span> Tous les
          paramètres doivent être dans les normes pour assurer une eau saine.
        </p>
      </div>
    </div>
  );
}
