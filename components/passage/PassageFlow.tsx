'use client';

import { useState } from 'react';
import { Step0Welcome } from './Step0Welcome';
import { Step1PhotoBefore } from './Step1PhotoBefore';
import { Step2PhotoAfter } from './Step2PhotoAfter';
import { Step3Measurements } from './Step3Measurements';
import { Step4Preview } from './Step4Preview';
import { Step5Confirmation } from './Step5Confirmation';
import { ProgressBar } from './ProgressBar';

interface PassageFlowProps {
  mission: {
    id: string;
    nom: string;
    adresse: string;
    ville: string;
    heure: string;
  };
  proprietaireEmail?: string;
}

export function PassageFlow({
  mission,
  proprietaireEmail = 'client@example.com',
}: PassageFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [photoBefore, setPhotoBefore] = useState<string | undefined>();
  const [photoAfter, setPhotoAfter] = useState<string | undefined>();
  const [measurements, setMeasurements] = useState({
    ph: '' as number | '',
    chlore: '' as number | '',
    temperature: '' as number | '',
  });

  const totalSteps = 6;

  const handlePhotoBeforeSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoBefore(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoAfterSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoAfter(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const canProceedToStep2 = photoBefore !== undefined;
  const canProceedToStep3 = photoBefore !== undefined && photoAfter !== undefined;
  const canProceedToStep4 =
    photoBefore !== undefined &&
    photoAfter !== undefined &&
    measurements.ph !== '' &&
    measurements.chlore !== '' &&
    measurements.temperature !== '';

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step0Welcome
            mission={mission}
            onStart={() => setCurrentStep(1)}
          />
        );

      case 1:
        return (
          <div>
            <Step1PhotoBefore
              preview={photoBefore}
              onPhotoSelect={handlePhotoBeforeSelect}
            />
            <div className="px-4 pb-6 space-y-2">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!canProceedToStep2}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-border disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Continuer
              </button>
              <button
                onClick={() => setCurrentStep(0)}
                className="w-full bg-surface hover:bg-border text-text font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Retour
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <Step2PhotoAfter
              beforePreview={photoBefore}
              afterPreview={photoAfter}
              onPhotoSelect={handlePhotoAfterSelect}
            />
            <div className="px-4 pb-6 space-y-2">
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!canProceedToStep3}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-border disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Continuer
              </button>
              <button
                onClick={() => setCurrentStep(1)}
                className="w-full bg-surface hover:bg-border text-text font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Retour
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <Step3Measurements
              data={measurements}
              onChange={setMeasurements}
            />
            <div className="px-4 pb-6 space-y-2">
              <button
                onClick={() => setCurrentStep(4)}
                disabled={!canProceedToStep4}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-border disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Aperçu
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full bg-surface hover:bg-border text-text font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Retour
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <Step4Preview
              photoBefore={photoBefore}
              photoAfter={photoAfter}
              ph={measurements.ph === '' ? undefined : measurements.ph}
              chlore={measurements.chlore === '' ? undefined : measurements.chlore}
              temperature={measurements.temperature === '' ? undefined : measurements.temperature}
              piscineNom={mission.nom}
              proprietaireEmail={proprietaireEmail}
            />
            <div className="px-4 pb-6 space-y-2">
              <button
                onClick={() => setCurrentStep(5)}
                className="w-full bg-success hover:bg-success/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Envoyer le rapport
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="w-full bg-surface hover:bg-border text-text font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Modifier les mesures
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <Step5Confirmation
            proprietaireEmail={proprietaireEmail}
            timestamp={new Date()}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      {renderStep()}
    </div>
  );
}
