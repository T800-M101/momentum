export interface JournalEntry {
  id: string;
  day: number;
  dayName: string;
  title: string;
  content: string;
  time: string;
  mood: 'happy' | 'productive' | 'sad' | 'neutral';
  mediaCount?: number;
}

export interface MoodOption {
  value: string;
  emoji: string;
  label: string;
  color: string; 
}
