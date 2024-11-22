import { create } from 'zustand'
import { rewardsStateInteface } from '../../models/zustand'

const rewardState = create<rewardsStateInteface>((set, get) => ({
	rewards: [],
	updateRewards(rewards) {
		set({ rewards })
	},
}))

export default rewardState
