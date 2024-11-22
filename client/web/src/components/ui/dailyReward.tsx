import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ReactComponent as Coin } from '../images/homepage/coin.svg'
import useStore from '../store/zustand'
const DailyReward = () => {
	const { coin_farmed, updateModalOfDaily, updateBalance, balance, modalOfDaily } = useStore()
	const { t } = useTranslation()

	const handleCloseModal = () => {
		updateModalOfDaily(false)
		updateBalance(balance + coin_farmed)
	}

	return (
		<>
			{modalOfDaily && coin_farmed !== 0 && (
				<AnimatePresence>
					<motion.div
						initial={{ y: '100%', opacity: 1 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.3 }}
						exit={{ y: '100%', opacity: 1 }}
						className='fixed inset-0 z-[999] flex items-end'
					>
						<motion.div
							initial={{ y: '100%', opacity: 1 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.3 }}
							exit={{ y: '100%', opacity: 1 }}
							className='w-full bg-myColors-100 h-[40vh] rounded-t-[30px] px-5 py-4 border-t border-myColors-700 shadow-[0_0_24px_34px_rgba(189,136,54,0.8)]'
						>
							<div className='flex flex-col justify-center items-center'>
								<p className='text-3xl w-full text-center font-medium text-white'>{t("earnedCoin")}</p>
								<div className='flex mt-5 items-center gap-2 w-full justify-center text-2xl'>
									<Coin className='w-[60px] h-[70px]' />
									<p className='text-3xl mb-2 font-bold relative z-10 text-white'>+{coin_farmed}</p>
								</div>

								<div className='absolute bottom-10 w-full flex justify-center'>
									<button
										className='w-[320px] h-[45px] flex items-center justify-center bg-myColors-500 rounded-2xl text-sm font-medium cursor-pointer'
										onClick={() => handleCloseModal()}
									>
										<p>{t("claim")}</p>
									</button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</AnimatePresence>
			)}
		</>
	)
}

export default DailyReward