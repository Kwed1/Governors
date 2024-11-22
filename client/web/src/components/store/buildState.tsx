import { create } from 'zustand'
import { buildStateInteface } from '../../models/zustand'

const buildState = create<buildStateInteface>((set, get) => ({
	buildings: [],
	total_friends: 0,
	updateTotalFriends(total_friends) {
		set({total_friends})
	},
	updateBuildings(buildings) {
		set({buildings})
	},
}));

export default buildState;
