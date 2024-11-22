import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNecessary } from '../../../hooks/necessary'
import SuccessSnackbar from '../../../hooks/successSnackbar'
import { placeReward } from '../../../models/placeReward'
import useApi from '../../../requestProvider/apiHandler'
import ErrorSnackbar from '../../../requestProvider/errorSnackbar'
import { ReactComponent as City } from '../../images/homepage/city.svg'
import { ReactComponent as Lock } from '../../images/homepage/Lock.svg'
import { ReactComponent as Unlock } from '../../images/homepage/unlock.svg'
import rewardState from '../../store/rewardState'
import useStore from '../../store/zustand'
import ModalOfRewards from '../modalOfRewards'

const OnlineGame = () => {
	interface gameCount {
		placeCount: number,
		total: number,
		gameReward: number
	}
	const [close, setClose] = useState<boolean>(true)
	const once = useRef<boolean>(false)
	const [count, setCount] = useState<gameCount>()
	const { t } = useTranslation()
	const [message, setMessage] = useState<string>('')
	const { getAccessToken, accessToken } = useStore()
	const [error, setError] = useState<string>('')
	const socketRef = useRef<WebSocket | null>(null)
	const [openModal, setOpenModal] = useState<boolean>(false)
	const api = useApi()
	const { updateRewards } = rewardState()


	const getRewardPlaces = async () => {
		const res = await api<placeReward[]>({
			url: `game/online/regwards`,
			method: 'GET'
		})
		if (res) updateRewards(res); console.log(res)

	}


	const initializeSocket = () => {


		const token = getAccessToken()
		if (!token) {
			console.error("No token found")
			return
		}

		const ws = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/online_ws?token=${token}`)

		ws.onopen = () => {
			ws.send(JSON.stringify({ type: 'getStatus' }))
		}

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data)
				console.log(data)

				if (data.placeCount !== undefined) {
					setCount({ placeCount: data.placeCount, total: data.total, gameReward: data.game_reward })
				}

				if (data.state !== undefined) {
					if (data.state === "idle") {
						setClose(true)
					} else {
						ws.send(JSON.stringify({ type: 'getInitialData' }))
						setClose(false)
						getRewardPlaces()
					}
				}

				if (data.claimed !== undefined) {
					if (data.claimed === true) {
						ws.send(JSON.stringify({ type: 'getInitialData' }))
					}
				}

			} catch {
				console.log("Error parsing WebSocket message")
			}
		}

		ws.onclose = () => {
			console.log('WebSocket connection closed')
		}

		socketRef.current = ws
	}

	useEffect(() => {
		if (!once.current) {
			initializeSocket()
			once.current = true
		}
	}, [])


	const { getData } = useNecessary()


	const handleClick = () => {
		console.log("qqq")

		if (socketRef.current) {
			socketRef.current.send(JSON.stringify({ type: 'onlineGame' }))
		}

		if (count?.gameReward === -1) {
			setError(t('snackbarError'))
			setTimeout(() => {
				setError('')
			}, 2000)
		} else {
			setMessage(t('snackbarSuccess'))
			setTimeout(() => {
				setMessage('')
			}, 2000)
			getData()
		}
	}

	return (
		<div className='h-[85vh] bg-myColors-50 bottom-0 w-full py-2 fixed'>
			{close ? (
				<>
					<div className='mt-5 text-white'>
						<div className='flex justify-center'>
							<Lock className='w-[35px]' />
						</div>
						<p className='text-center opacity-[30%]'>{t('onlineStartClose')}</p>
						<p className='text-center opacity-[30%]'>{t('onlineDescrClose')}</p>

						<div className='relative'>
							<div className='flex justify-center mt-5'>
								<City className='w-[200px] h-[200px] ' />
								<p className="absolute top-[37%] text-3xl font-bold" >
									TAP
								</p></div>
						</div>
					</div>
				</>
			) : (
				<>
					<div className='mt-5 text-white'>
						<div className='flex justify-center'>
							<Unlock className='w-[35px]' />
						</div>
						<p className='text-center text-3xl font-medium'>{count?.placeCount}/{count?.total}</p>
						<p className='text-center text-sm text-myColors-250'>{count?.gameReward === -1 ? `${t('claimedReward')}` : `${t('adminReward')} ${count?.gameReward}`}</p>

						<div className='w-full flex justify-center mt-2'>
							<button className='text-sm bg-myColors-250 p-2 rounded-xl' onClick={() => setOpenModal(true)}>Check the places</button>
						</div>

						<div className='relative'>
							<div className='flex justify-center mt-5'>
								<City className='w-[200px] h-[200px] ' />
								<p className='absolute top-[37%] text-3xl font-bold' onClick={handleClick}>TAP</p>
							</div>
						</div>
						<p className='text-center opacity-30 mt-2'>{t('onlineStartOpen')}</p>
						<p className='text-center opacity-30 text-sm'>{t('onlineDescrOpen')}</p>
					</div>
				</>
			)}
			<SuccessSnackbar message={message} />
			<ErrorSnackbar error={error} onClose={() => setError('')} />

			{openModal && (
				<ModalOfRewards setOpenModal={setOpenModal} />
			)}
		</div>
	)
}

export default OnlineGame