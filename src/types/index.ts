export interface Member {
  id: string;
  name: string;
  role: string;
  timeLimit: number;
  recordingUrl?: string;
}

export interface TeamPreset {
  id: string;
  name: string;
  members: Member[];
}

export interface Recording {
  url: string;
  timestamp: number;
  duration: number;
}