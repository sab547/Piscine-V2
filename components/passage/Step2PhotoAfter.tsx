'use client';

import { PhotoUpload } from './PhotoUpload';

interface Step2PhotoAfterProps {
  beforePreview?: string;
  afterPreview?: string;
  onPhotoSelect: (file: File) => void;
}

export function Step2PhotoAfter({
  beforePreview,
  afterPreview,
  onPhotoSelect,
}: Step2PhotoAfterProps) {
  const tips = [
    'Prenez la photo sous le même angle que la photo avant',
    'Montrez l\'état actuel de la piscine après intervention',
    'Assurez-vous que les conditions d\'éclairage sont similaires',
  ];

  return (
    <div className="space-y-6">
      {beforePreview && (
        <div className="px-4 pt-6">
          <p className="text-sm font-semibold text-text-muted mb-3">
            Comparaison avant/après
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg overflow-hidden border border-border">
              <img
                src={beforePreview}
                alt="Avant"
                className="w-full aspect-square object-cover"
              />
              <p className="bg-surface text-xs font-semibold text-text text-center py-2">
                Avant
              </p>
            </div>
            {afterPreview && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img
                  src={afterPreview}
                  alt="Après"
                  className="w-full aspect-square object-cover"
                />
                <p className="bg-success/10 text-xs font-semibold text-success text-center py-2">
                  Après
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <PhotoUpload
        label="Photo après intervention"
        preview={afterPreview}
        onPhotoSelect={onPhotoSelect}
        tips={tips}
      />
    </div>
  );
}
