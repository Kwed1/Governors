import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ReactComponent as Doublegift } from '../../images/friendpage/doublegift.svg'
import { ReactComponent as Onegift } from '../../images/friendpage/onegift.svg'
const FriendDescr = () => {
	const {t} = useTranslation()
	return (
		<>
		<motion.div initial={{x: -1000}} animate={{x: 0}} transition={{delay: 0.2}} >
		<div className='w-full bg-myColors-200 px-2 flex justify-between items-center rounded-2xl border-dashed border border-myColors-500 h-[70px]'>

			<div className='flex flex-col gap-1 mb-2'>
				<p className='font-medium text-[14px]'>{t("invFriend")}</p>
				<p className='text-[12px] opacity-70'>{t("invFriendDescr")}</p>
			</div>

			<div>
					<Onegift className='w-[60px] h-[70px]'/>
			</div>

			</div>

			<div className='relative w-full bg-myColors-200 px-2 flex items-center rounded-2xl border border-myColors-500 border-dashed mt-3 h-[70px]'>

			<div className='flex flex-col gap-1 mb-2'>
				<p className='font-medium text-[14px]'>{t("invFriendPrem")}</p>
				<p className='text-[12px] opacity-70'>{t("invFriendPremDescr")}</p>
			</div>

			<div className='absolute right-1'>
				<Doublegift className='w-[100px] h-[70px]'/>
			</div>

		</div>
		</motion.div>
		</>
	)
}

export default FriendDescr