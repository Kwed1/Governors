import { Dispatch, SetStateAction } from 'react'
import { ReactComponent as Close } from '../images/rewardspage/close.svg'
import rewardState from '../store/rewardState'
interface Props {
	setOpenModal: Dispatch<SetStateAction<boolean>>
}
const ModalOfRewards: React.FC<Props> = ({ setOpenModal }) => {
	const { rewards } = rewardState()
	return (
		<div className="absolute top-10 left-0 w-full flex items-center justify-center bg-black bg-opacity-50 z-[9999] overflow-hidden">
			<div className="bg-myColors-350 w-[350px] h-[500px] overflow-y-auto p-4 rounded-md shadow-lg flex flex-col items-center">
				<div className='w-full flex justify-end'><Close className='w-[40px] h-[40px]' onClick={() => setOpenModal(false)} /></div>
				<p className='text-xl font-bold text-myColors-250'>Places</p>
				<div className='flex w-full justify-center items-center flex-col mt-2 gap-2'>
					{rewards.map((reward, index) => (
						<div className='flex justify-around w-full items-center' key={index}>
							<div className='flex text-white'>
								<p>{reward.from_place}</p>
								<p>-</p>
								<p>{reward.to_place}</p>
							</div>

							<p className='text-white text-sm'>Reward: <span className='text-myColors-250 font-bold text-sm'>{reward.reward}GT</span></p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
export default ModalOfRewards
