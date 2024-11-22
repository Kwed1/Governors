import { buildings } from './buildings'
import { games } from './games'
import { missions } from './missions'
import { placeReward } from './placeReward'

export interface storeInterface {
	accessToken: string,
	role: string,
	lvl: number,
	lng: string,
	balance: number,
	coin_per_hour: number,
	coin_farmed: number,
	modalOfDaily: boolean,
	status: null | string,
	diamonds: number,
	updateStatus: (status: string | null) => void
	updateDiamonds: (diamonds: number) => void
	updateModalOfDaily: (modalOfDaily: boolean) => void
	updateRole: (role: string) => void,
	updateCoinFarmed: (coin_farmed: number) => void
	updateCoinPerHour: (coin_per_hour: number) => void
	updateLvl: (lvl: number) => void,
	updateBalance: (balance: number) => void,
	updateLng: (lng: string) => void,
	updateAccessToken: (accessToken: string) => void,
	getAccessToken: () => string
}


export interface dataStateInterface {
	missions: missions[],
	updateMissions: (missions: missions[]) => void
}

export interface buildStateInteface {
	buildings: buildings[],
	total_friends: number,
	updateTotalFriends: (total_friends:number) => void
	updateBuildings: (buildings: buildings[]) => void
}

export interface gamesStateInteface {
	games: games[],
	updateGames: (buildings: games[]) => void
}

export interface rewardsStateInteface {
	rewards: placeReward[],
	updateRewards: (rewards: placeReward[]) => void
}
