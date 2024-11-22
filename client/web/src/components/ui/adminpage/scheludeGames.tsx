import { useTranslation } from 'react-i18next'
import { formatDateString } from '../../../hooks/convertDate'
import { useNecessary } from '../../../hooks/necessary'
import useApi from '../../../requestProvider/apiHandler'
import { ReactComponent as Delete } from '../../images/adminpage/delete.svg'
import gamesState from '../../store/gamesState'
const ScheludeGames = () => {
	const {t} = useTranslation()
	const {games} = gamesState()
	const {getGames} = useNecessary()
	const api = useApi()

	const deteleGame = async(id:string) => {
		const res = await api({
			method: 'DELETE',
			url: `/game/?game_id=${id}`
		})
		getGames()
	}


	return (
		<>
		<p className='text-center text-lg font-bold'>{t("adminScheludeGames")}</p>
		<div className='h-[120px] overflow-y-scroll'>

			{games.map((game, index) => (
				game.end === "Schedule" && (
					<div className={`flex justify-between mt-3 items-center text-sm px-4 border-opacity-0 text-white bg-myColors-350 rounded-xl py-2`} key={index}>
					<div className='flex flex-col'>
						<p>{game.name}</p>
						<p>Participants: {game.participants}</p>
						<p>Start: {formatDateString(game.start)}</p>
						<p>End: {game.end} </p>
					</div>

					<div className='mr-3'>
						<Delete className='w-[25px] h-[25px]' onClick={() => deteleGame(game.id)}/>
					</div>
				</div>
				)
			))}
			
			</div>
		</>
	)
}

export default ScheludeGames