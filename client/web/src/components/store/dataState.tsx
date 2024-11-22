import { create } from 'zustand'
import { dataStateInterface } from '../../models/zustand'

const useData = create<dataStateInterface>((set, get) => ({
	missions: [],
	updateMissions(missions) {
		set({missions})
	},
}));

export default useData;
