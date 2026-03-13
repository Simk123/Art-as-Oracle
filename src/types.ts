
export interface Lens {
  name: string;
  definition: string;
}

export interface Card {
  position: "I" | "II" | "III";
  role: "The Provocation" | "The Response" | "The Parallel";
  met_object_id: number;
  title: string;
  artist: string;
  date: string;
  culture: string;
  reading: string;
  visual_detail: string;
  connection_to_previous: string | null;
  imageUrl?: string; // Added for UI
  objectUrl?: string; // Link to Met website
}

export interface Reading {
  lens: Lens;
  cards: Card[];
  synthesis: string;
}
