
export interface storeInterface {
	accessToken: string,
	role: string,
	lvl: number,
	lng: string,
	balance: number,
	coin_per_hour: number,
	updateRole: (role: string) => void,
	updateCoinPerHour: (coin_per_hour: number) => void
	updateLvl: (lvl: number) => void,
	updateBalance: (balance: number) => void,
	updateLng: (lng: string) => void,
	updateAccessToken: (accessToken: string) => void,
	getAccessToken: () => string
}

