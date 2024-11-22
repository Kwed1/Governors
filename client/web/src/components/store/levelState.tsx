import { create } from 'zustand'
import { LevelsStoreInt } from '../models/LevelsStore'

const useLevelsStore = create<LevelsStoreInt>((set, get) => ({
	levels: [],
	setLevels(levels) {
		set({levels})
	},
}));

export default useLevelsStore;
