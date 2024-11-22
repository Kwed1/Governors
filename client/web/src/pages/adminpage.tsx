import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useStore from '../components/store/zustand'
import ActiveGames from '../components/ui/adminpage/activeGames'
import AddMissions from '../components/ui/adminpage/addMissions'
import AddOnlineGame from '../components/ui/adminpage/addOnlinegame'
import AddPhysicalGame from '../components/ui/adminpage/addPhysicalgame'
import PreviousGames from '../components/ui/adminpage/previousGames'
import RemoveMissions from '../components/ui/adminpage/removeMissions'
import ScheludeGames from '../components/ui/adminpage/scheludeGames'
import '../components/ui/background.css'
const Adminpage = () => {
	const { t } = useTranslation()
	const { role } = useStore()
	const navigate = useNavigate()

	useEffect(() => {
		if (role !== 'admin') {
			navigate('/')
		}
	}, [])

	return (
		<>
			<div className='backgroundSettings' />

			<div className="flex flex-col justify-center items-center">

				<div className='max-w-[350px] w-full text-white pb-[150px]'>

					<div className='mt-5'>
						<p className='text-white text-2xl font-bold text-center'>{t('adminCreateGame')}</p>
					</div>

					<div className='mt-10'>
						<AddOnlineGame />
					</div>

					<div className='mt-3'>
						<AddPhysicalGame />
					</div>

					<div className='mt-3'>
						<AddMissions />
					</div>

					<div className='mt-3'>
						<RemoveMissions />
					</div>

					<div className='mt-5'>
						<ActiveGames />
					</div>

					<div className='mt-5'>
						<ScheludeGames />
					</div>

					<div className='mt-5'>
						<PreviousGames />
					</div>

				</div>

			</div>
		</>
	)
}

export default Adminpage