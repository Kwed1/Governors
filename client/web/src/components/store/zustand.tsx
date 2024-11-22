import { create } from 'zustand'
import { storeInterface } from '../../models/zustand'

const useStore = create<storeInterface>((set, get) => ({
	accessToken: '',
	role: '',
	lvl: 0,
	lng: '',
	balance: 0,
	coin_per_hour: 0,
	coin_farmed: 0,
	status: null,
	diamonds: 0,
	modalOfDaily: true,
	updateModalOfDaily: (modalOfDaily: boolean) => {
		set(() => ({ modalOfDaily }))
	},
	updateRole: (role: string) => {
		set(() => ({ role }))
	},
	updateCoinFarmed: (coin_farmed: number) => {
		set(() => ({ coin_farmed }))
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
		set(() => ({ accessToken }))
	},
	updateStatus: (status: string | null) => {
		set(() => ({ status }))
	},
	updateDiamonds: (diamonds: number) => {
		set(() => ({ diamonds }))
	},
	getAccessToken: () => {
		return get().accessToken
	},
}))

export default useStore
