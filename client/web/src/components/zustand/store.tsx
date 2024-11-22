import { create } from 'zustand'
import { storeInterface } from '../../components/models/zustand'

const useStore = create<storeInterface>((set, get) => ({
	accessToken: '',
	role: '',
	lvl: 0,
	lng: '',
	balance: 0,
	coin_per_hour: 0,

	updateRole: (role: string) => {
		set(() => ({ role }));
	},
	updateLvl: (lvl: number) => {
		set(() => ({ lvl }))
	},
	updateCoinPerHour: (coin_per_hour: number) => {
		set(() => ({ coin_per_hour }))
	},
	updateBalance: (balance: number) => {
		set(() => ({ balance }))
	},
	updateLng: (lng: string) => {
		set(() => ({ lng }))
	},
	updateAccessToken: (accessToken: string) => {
		set(() => ({ accessToken }));
	},
	getAccessToken: () => {
		return get().accessToken;
	},
}));

export default useStore;
