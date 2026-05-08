'use client';

import { Camera, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import Image from 'next/image';

interface PhotoUploadProps {
  onPhotoSelect: (file: File) => void;
  preview?: string;
  label: string;
  tips?: string[];
}

export function PhotoUpload({
  onPhotoSelect,
  preview,
  label,
  tips = [],
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        // Store in sessionStorage for quick access
        sessionStorage.setItem('photo_preview', url);
      };
      reader.readAsDataURL(file);
      onPhotoSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold text-text font-display">{label}</h2>

      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary'
          }`}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex flex-col items-center gap-2 w-full"
          >
            <Camera className="w-12 h-12 text-primary" />
            <p className="text-sm font-semibold text-text">
              Appuyez pour ajouter ou glissez une photo
            </p>
            <p className="text-xs text-text-muted">
              PNG, JPG jusqu'à 5 MB
            </p>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative bg-surface rounded-lg overflow-hidden">
          <div className="relative w-full aspect-square">
            <img
              src={preview}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
              onPhotoSelect(null as any);
            }}
            className="absolute top-2 right-2 bg-danger text-white p-2 rounded-lg hover:bg-danger/90 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {tips.length > 0 && (
        <div className="bg-accent/10 border border-accent rounded-lg p-4">
          <h3 className="text-sm font-semibold text-text mb-2">Conseils :</h3>
          <ul className="space-y-1">
            {tips.map((tip, i) => (
              <li key={i} className="text-xs text-text-muted flex gap-2">
                <span className="text-accent">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
