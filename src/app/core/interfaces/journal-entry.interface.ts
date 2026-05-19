export interface JournalImage {
  url: string;
  alt?: string;
}

export interface JournalEntry {
  id: number;
  title: string;
  mood: string;
  date: string;
  content: string;
  images?: JournalImage[];
  time?: string;
}

export interface MoodOption {
  value: string;
  emoji: string;
  label: string;
}
