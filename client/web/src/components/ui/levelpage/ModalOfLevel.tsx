import { Dispatch, SetStateAction } from 'react'
import { GetLevelsType } from '../../../pages/levelpage/type'
import { ReactComponent as Close } from '../../images/airdrop/close.svg'
interface Props {
	modalInfo: GetLevelsType | null
	setIsOpen: Dispatch<SetStateAction<boolean>>
}
export default function ModalOfLevel({setIsOpen, modalInfo}:Props) {
	return (
		<div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-white transition-opacity duration-300 ease-in-out`}>
		<div
			className={`bg-myColors-800 border border-myColors-850 rounded-[35px] py-2 pb-4 px-4 md:max-w-md mx-2 z-60 transform w-[350px] transition-transform duration-300 ease-in-out`}
		>
			<div className='flex justify-end'>
				<Close
					className='w-[25px]'
					onClick={() => {
						setIsOpen(false)
					}}
				/>
			</div>

			<p className='text-xl text-center'>Level {modalInfo?.lvl}</p>
			<p className='text-lg mt-5 px-5 pb-2'>
			-{modalInfo?.reward} GT/Spot<br/>
			-Claim {modalInfo?.claim} Spots per day<br/>
			-Generate Locations {modalInfo?.open_at} per day
			</p>
		</div>
	</div>
	)
}