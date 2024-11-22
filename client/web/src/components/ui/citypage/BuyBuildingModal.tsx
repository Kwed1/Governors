import { useTranslation } from 'react-i18next'
import { buildings } from '../../../models/buildings'
import { ReactComponent as Close } from '../../images/airdrop/close.svg'
interface Props {
	setModalInfo: React.Dispatch<React.SetStateAction<buildings | undefined>>
	modalInfo: buildings | undefined
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
	buyBuilding: () => Promise<void>
}


const BuyBuildingModal = ({setModalInfo, setOpenModal, modalInfo, buyBuilding}:Props) => {
	const {t} = useTranslation()
	if (modalInfo?.lvl === 0) return  (
		<div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-white transition-opacity duration-300 ease-in-out`}>
		<div
			className={`bg-myColors-800 border border-myColors-850 rounded-[35px] py-2 pb-4 px-4 md:max-w-md mx-2 z-60 transform w-[350px] transition-transform duration-300 ease-in-out`}
		>
			<div className='flex justify-end'>
				<Close
					className='w-[25px]'
					onClick={() => {
						setModalInfo(undefined)
						setOpenModal(false)
					}}
				/>
			</div>
			<p className='text-center font-bold text-xl'>{t('buyBuilding')}</p>
			<p className='text-center mt-5'>
				{t("?forbuy")} <span className='text-myColors-250 font-bold'>{`${modalInfo?.price}GT`}</span> ?
			</p>
			<div className='flex gap-5 justify-center items-center mt-10'>
				<button
					className='p-2 px-4 bg-myColors-500 font-bold w-[130px] rounded-3xl'
					style={{ boxShadow: '0 4px 25px rgba(247, 174, 59, 1)' }}
					onClick={buyBuilding}
				>
					{t("buy")}
				</button>
			</div>
		</div>
	</div>
	)
	
	return (
		<div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-white transition-opacity duration-300 ease-in-out`}>
		<div
			className={`bg-myColors-800 border border-myColors-850 rounded-[35px] py-2 pb-4 px-4 md:max-w-md mx-2 z-60 transform w-[350px] transition-transform duration-300 ease-in-out`}
		>
			<div className='flex justify-end'>
				<Close
					className='w-[25px]'
					onClick={() => {
						setModalInfo(undefined)
						setOpenModal(false)
					}}
				/>
			</div>
			<p className='text-center font-bold text-xl'>{t('buyUpgrade')}</p>
			<p className='text-center mt-5'>
				{t("?forupgrade")} <span className='text-myColors-250 font-bold'>{`${modalInfo?.price}GT`}</span> ?
			</p>
			<div className='flex gap-5 justify-center items-center mt-10'>
				<button
					className='p-2 px-4 bg-myColors-500 font-bold w-[130px] rounded-3xl'
					style={{ boxShadow: '0 4px 25px rgba(247, 174, 59, 1)' }}
					onClick={buyBuilding}
				>
					{t("buy")}
				</button>
			</div>
		</div>
	</div>
	)
}

export default BuyBuildingModal