export interface JournalImage {
  url: string;
  alt?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Mood {
  id: number;
  label: string;
  emoji: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  mood: Mood;
  emoji: string;
  date: Date;
  content: string;
  tags?: Tag[]
  images: JournalImage[];
  createdAt: Date;
  updatedAt?: Date;
}

