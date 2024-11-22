import { useTranslation } from 'react-i18next'
import { formatDateString } from '../../../hooks/convertDate'
import { ReactComponent as Loading } from '../../images/adminpage/loading.svg'
import gamesState from '../../store/gamesState'
const ActiveGames = () => {
	const {t} = useTranslation()
	const {games} = gamesState()
	return (
		<>
		  <p className='text-center text-lg font-bold'>{t('adminActiveGames')}</p>
			<div className='h-[120px] overflow-y-scroll'>
				{games.map((game, index) => (
					game.end === 'Live' && (
						<div className={`flex justify-between mt-3 items-center text-sm px-4 border-opacity-0 text-white bg-myColors-350 rounded-xl py-2`} key={index}>
							<div className='flex flex-col' >
								<p>{game.name}</p>
								<p>Participants: {game.participants}</p>
								<p>Start: {formatDateString(game.start)}</p>
								<p>End: {game.end}</p>
							</div>

							<div className='mr-3'>
								<Loading className='w-[35px]'/>
							</div>
						</div>
					)
				))}

			

			</div>
			

			
		</>
	)
}

export default ActiveGames