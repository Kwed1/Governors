import { Dispatch, SetStateAction } from 'react'
import Close from "../../../../images/airdrop/close.svg"
import { ModalInfoInt } from '../Map'
interface Props {
	setClaimModal: Dispatch<SetStateAction<boolean>>
	modalInfo: ModalInfoInt
}
export default function ClaimLocationModal({setClaimModal, modalInfo}: Props) {
	return (
			<div className="fixed inset-0 z-[10000] bg-opacity-50 bg-black flex items-center justify-center text-white">
			<div
				className={`bg-myColors-800 border border-myColors-850 rounded-[35px] py-2 pb-4 px-4 md:max-w-md mx-2 z-60 transform w-[350px] transition-transform duration-300 ease-in-out`}
			>
				<div className="flex justify-end">
					<button
						className="w-[30px] h-[30px] flex justify-center items-center"
						onClick={() => setClaimModal(false)}
					>
						<img src={Close} alt="" className="w-[30px] h-[30px]" />
					</button>
				</div>
				<p className='text-center text-xl'>Location Completed</p>
				<div className="flex flex-col text-center font-medium text-xl mt-2">
					<p>{modalInfo?.diamonds} 💎</p>
					<p className='text-myColors-250'>{modalInfo?.reward} GT</p>
				</div>
				<div className="flex gap-5 justify-center items-center mt-5">
					<button
						className="p-2 px-4 bg-myColors-500 font-bold w-[130px] rounded-3xl"
						style={{ boxShadow: "0 4px 25px rgba(247, 174, 59, 1)" }}
						onClick={()=>setClaimModal(false)}
					>
						Okey
					</button>
				</div>
			</div>
		</div>
	)
}