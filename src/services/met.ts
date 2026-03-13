
const MET_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

export interface MetObject {
  objectID: number;
  primaryImage: string;
  primaryImageSmall: string;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  culture: string;
  objectURL: string;
  message?: string; // For error handling
}

export async function fetchMetObject(id: number): Promise<MetObject | null> {
  try {
    const response = await fetch(`${MET_BASE_URL}/objects/${id}`);
    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Met API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching object ${id}:`, error);
    return null;
  }
}
