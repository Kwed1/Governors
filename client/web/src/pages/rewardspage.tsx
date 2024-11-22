import { useTranslation } from 'react-i18next'
import chest from '../components/images/chest.png'
import TaskTable from '../components/ui/rewardspage/taskTable'

const Rewardspage = () => {
	const {t} = useTranslation()
	return (
		<>
			<div className='h-[50px] items-center flex justify-center text-white text-2xl font-bold bg-myColors-100 rounded-t-[30px] gap-2'>
				<p className='mb-1'>{t("rewards")}</p>
			</div>

			<div className='h-full p-5 text-white bg-myColors-450 '>

				<div className='px-5 font-medium tracking-wide flex items-center justify-between'>

				<p className='text-4xl' dangerouslySetInnerHTML={{ __html: t('rewardEarnCoin') }}>

				</p>

				<div className='relative'>
				<img src={chest} className='w-[200px] h-[180px]'/>
				<div className='absolute inset-0 bg-myColors-550 bg-opacity-[67%] w-[150px] h-[150px] top-5 left-[15%] rounded-full blur-2xl'/>
				</div>
				</div>

				<div className='mt-10'>
				<TaskTable/>
				</div>

			</div>
		</>
	)
}

export default Rewardspage