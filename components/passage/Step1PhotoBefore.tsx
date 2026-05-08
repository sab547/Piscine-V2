'use client';

import { PhotoUpload } from './PhotoUpload';

interface Step1PhotoBeforeProps {
  preview?: string;
  onPhotoSelect: (file: File) => void;
}

export function Step1PhotoBefore({
  preview,
  onPhotoSelect,
}: Step1PhotoBeforeProps) {
  const tips = [
    'Prenez une photo claire de l\'ensemble de la piscine',
    'Évitez les ombres directes',
    'Assurez-vous que le soleil n\'est pas en arrière-plan',
  ];

  return (
    <PhotoUpload
      label="Photo avant intervention"
      preview={preview}
      onPhotoSelect={onPhotoSelect}
      tips={tips}
    />
  );
}
