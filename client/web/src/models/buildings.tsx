
export interface buildings {
  id: string,
  lvl: number,
  price: number,
  name: string,
  per_hour: number,
  state: string,
  rank_need_to_buy: null | string
  friend_to_lvl_up: number
  next_lvl_price: number
}

export interface MyCityData {
  total_friends: number,
  data: buildings[]
}