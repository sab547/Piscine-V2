import NodeGeocoder from 'node-geocoder';

const geocoder = NodeGeocoder({
  provider: 'openstreetmap',
});

export async function geocodeAddress(
  address: string,
  city: string,
  postalCode: string
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const fullAddress = `${address}, ${postalCode} ${city}, France`;
    const results = await geocoder.geocode(fullAddress);

    if (results && results.length > 0) {
      const { latitude, longitude } = results[0];
      if (latitude !== undefined && longitude !== undefined) {
        return {
          latitude,
          longitude,
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Haversine formula - distance in km
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
