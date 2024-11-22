export interface friendsData {
	user_name: string,
  bonus: number,
  inviter_id: number
}

export interface friends {
	user_inviter: string,
	data: friendsData[],
	total: number
}