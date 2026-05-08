'use client';

import { PassageFlow } from '@/components/passage/PassageFlow';
import { mockMissions, mockProprietaire } from '@/lib/mock-data';

interface PassagePageProps {
  params: {
    missionId: string;
  };
}

export default function PassagePage({ params }: PassagePageProps) {
  // Get mission data from mock data
  const mission = mockMissions.find((m) => m.id === params.missionId);

  if (!mission) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-lg font-semibold text-text">Mission non trouvée</p>
      </div>
    );
  }

  return (
    <PassageFlow
      mission={{
        id: mission.id,
        nom: mission.client,
        adresse: mission.adresse.split(',')[0],
        ville: mission.adresse.split(',')[1] || 'PACA',
        heure: mission.heure,
      }}
      proprietaireEmail={mockProprietaire.email}
    />
  );
}
