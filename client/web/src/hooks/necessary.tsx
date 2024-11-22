
import { jwtDecode } from "jwt-decode"
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/base/header'
import { ReactComponent as Insta } from '../components/images/Insta.svg'
import { ReactComponent as Twit } from '../components/images/twitter.svg'
import Loadingg from '../components/images/Waiting.png'
import buildState from '../components/store/buildState'
import useData from '../components/store/dataState'
import gamesState from '../components/store/gamesState'
import useStore from '../components/store/zustand'
import '../components/ui/background.css'
import NavPanel from '../components/ui/NavPanel'
import { MyCityData } from '../models/buildings'
import { data } from '../models/data'
import { games } from '../models/games'
import { missions } from '../models/missions'
import useLevelApi from '../pages/levelpage/api/useLevelApi'
import PremiumPackagesApi from '../pages/premiumpage/api/GetPackages'
import useApi from '../requestProvider/apiHandler'
import { useTelegram } from './useTelegram'
const NavContext = createContext<NavContextType | undefined>(undefined)


interface NavContextType {
	getMissions: () => void
	getBuildings: () => void
	getData: () => void
	getGames: () => void
}

export interface idInterface {
	token: string,
}

export const useNecessary = () => {
	const context = useContext(NavContext)

	if (context === undefined) {
		throw new Error('useNecessary must be used within a NavPanelProvider')
	}
	return context
}

interface NavPanelProviderInt {
	children: ReactNode
}

interface decode {
	sub: string,
	user_id: number,
	role: string,
	exp: number
}

export const NavPanelProvider = ({ children }: NavPanelProviderInt) => {
	const location = useLocation()
	const api = useApi()
	const once = useRef<boolean>(false)
	const { updateAccessToken, updateRole, getAccessToken, updateBalance, updateLng, updateLvl, updateCoinPerHour, role, balance, coin_per_hour, updateDiamonds, updateStatus} = useStore()
	const { user, userId, name } = useTelegram()
	const { updateMissions } = useData()
	const { updateBuildings, updateTotalFriends } = buildState()
	const { updateGames } = gamesState()
	const token = getAccessToken()
	const {getPremiumPackages} = PremiumPackagesApi()
	const [loading, setLoading] = useState<boolean>(true)
	const {getLevels} = useLevelApi()
	const getMissions = async (): Promise<void> => {
		if (!token) return
		const res = await api<missions[]>({
			url: '/mission/get-user-missions',
			method: 'GET'
		})
		if (res) {
			updateMissions(res)
		}
	}

	const getData = async () => {
		if (!token) return
		const res = await api<data>({
			method: 'GET',
			url: `/identity/get-data`,
		})
		if (res) {
			updateBalance(res?.current_coin)
			updateLng(res?.language)
			updateLvl(res?.lvl)
			updateCoinPerHour(res?.coin_per_hour)
			updateStatus(res?.status)
			updateDiamonds(res?.diamonds)
		}
	}

	const getId = async (): Promise<void> => {
		const res = await api<idInterface>({
			method: 'POST',
			url: `/identity/sign-in/?user_id=${userId}&username=${user !== null ? user : name}`
		})
		if (res) {
			updateAccessToken(res.token)
			const decoded: decode = jwtDecode(res.token)
			updateRole(decoded.role)
		}
	}

	const getBuildings = async (): Promise<void> => {
		if (!token) return
		const res = await api<MyCityData>({
			url: '/building/',
			method: 'GET'
		})
		if (res) {
			updateBuildings(res?.data)
			updateTotalFriends(res?.total_friends)
		}
	}

	const getGames = async () => {
		const res = await api<games[]>({
			url: '/game/',
			method: 'GET'
		})
		if (res) {
			updateGames(res)
		}
	}

	useEffect(() => {
		if (!once.current) {
			getId()
			once.current = true
		}
	}, [])

	const initial = useCallback(async () => {
		await Promise.all([getData(), getMissions(), getBuildings(), getPremiumPackages(), getLevels()])
		setLoading(false)
		if (role === 'admin') {
			getGames()
		}
	}, [role])

	useEffect(() => {
		if (token) {
			initial()
		}
	}, [token, initial])

	useEffect(() => {
		const coinsPerSecond = coin_per_hour / 3600

		const intervalId = setInterval(() => {
			updateBalance(balance + coinsPerSecond)
		}, 1000)

		return () => clearInterval(intervalId)
	}, [coin_per_hour, balance, updateBalance])

	interface props {
		page: string
	}

	const Background = ({ page }: props) => {
		switch (page) {
			case '/friends': return <div className='backgroundFriends' />
			case '/rewards': return <div className='backgroundReward' />
			case '/airdrop': return <div className='backgroundAirdrop' />
			default: return null
		}
	}

	const memoizedHeader = useMemo(() => {
		if (location.pathname !== '/Settings' && location.pathname !== '/admin'&& location.pathname !== '/premium' && location.pathname !== '/level') {
			return (
				<>
					<div className='relative'>
						<Header />
					</div>
				</>
			)
		}
		return null
	}, [location.pathname])

	if (loading) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
				<div className='relative'>
					<img src={Loadingg} alt="" className='h-[100vh] w-[100vh]' />
					<div className='absolute bottom-[10vh] left-[36%] flex gap-2'>

						<div className='w-[50px] bg-myColors-750 h-[50px] flex flex-col items-center justify-center rounded-full p-3'>
							<Insta />
						</div>

						<div className='w-[50px] bg-myColors-750 h-[50px] flex flex-col items-center justify-center rounded-full p-3'>
							<Twit />
						</div>

					</div>
				</div>
			</div>
		)
	}



	return (
		<>
			<NavContext.Provider value={{ getMissions, getBuildings, getData, getGames }}>
				<Background page={location.pathname} />

				{memoizedHeader}

				{location.pathname === '/rewards' ? (
					<>
						<div className={`fixed w-full h-[80vh] bg-myColors-100 rounded-t-[30px] bottom-0`}>
							{children}
							<NavPanel />
						</div>
					</>
				) : (
					<>
						{children}
						<NavPanel />
					</>
				)}
			</NavContext.Provider>
		</>
	)
}