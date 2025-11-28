// Interface untuk Data Teams
export interface Team {
  id: string;         // UUID (String)
  name: string;
  city: string;
  conference: string; // 'East' | 'West'
}

// Interface untuk Data Players
export interface Player {
  id: string;         // UUID (String)
  name: string;
  position: string;
  jersey_number: number;
  team_id: string;    // Relasi ke Team (UUID)
  teams?: {
    name: string;
    city: string;
  };
}

// Interface untuk Data Standings (Klasemen)
export interface Standing {
  id: string;         // UUID (String)
  team_id: string;    // Relasi ke Team (UUID)
  wins: number;
  losses: number;
  conference: string; // 'East' | 'West'
  rank: number;
  teams?: {
    name: string;
    city: string;
  };
}

export interface BoxScore {
  id: string;         
  player_id: string;  
  points: number;
  rebounds: number;
  assists: number;
  game_date: string;
  opponent: string;
  players?: {
    name: string;
    position: string;
    teams?: {
      name: string;
    };
  };
}