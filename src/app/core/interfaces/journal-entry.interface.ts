export interface JournalImage {
  url: string;
  alt?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface JournalEntry {
  id: number;
  title: string;
  mood: string;
  emoji: string;
  date: Date;
  content: string;
  tags?: Tag[]
  images: JournalImage[];
  createdAt: Date;
  updatedAt?: Date;
}

