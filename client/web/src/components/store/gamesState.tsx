import { create } from 'zustand'
import { gamesStateInteface } from '../../models/zustand'

const gamesState = create<gamesStateInteface>((set, get) => ({
	games: [],
	updateGames(games) {
		set({games})
	},
}));

export default gamesState;
