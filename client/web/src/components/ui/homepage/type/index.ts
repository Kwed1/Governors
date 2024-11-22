export interface LocationInfo {
  claimed_count: number,
  generate_chance: number,
  claimed_need_to_reward: number,
  generate_max_chanced: number,
  virtual_picks: number
  reward: number
}

export interface GeneratedPoints {
  latitude: number,
  longitude: number,
  id: string
  reward: number,
  diamond_reward: number,
}

export interface getGenerated extends LocationInfo {
  points: GeneratedPoints[]
}