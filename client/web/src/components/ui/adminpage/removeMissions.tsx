import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNecessary } from '../../../hooks/necessary'
import useApi from '../../../requestProvider/apiHandler'
import { ReactComponent as Delete } from '../../images/adminpage/delete.svg'
import { ReactComponent as Close } from '../../images/airdrop/close.svg'
import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as Coin } from '../../images/homepage/coin.svg'
import useData from '../../store/dataState'
import { GetIcon } from '../rewardspage/taskTable'
const RemoveMissions = () => {
const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
const {missions} = useData()
const {getMissions} = useNecessary()
const api = useApi()

const handleRemove = async (id:string) => {
	const res = await api({
		method: 'POST',
		url: `/mission/remove-mission?id=${id}`
	})
	getMissions()
}
const {t} = useTranslation()
	return (
		<>
		<div className="flex justify-between mt-2 items-center text-sm px-2 border-opacity-0 text-white bg-myColors-350 rounded-xl h-[55px]"  onClick={() => setModalIsOpen(true)}>
        <div className="flex gap-5 items-center ml-2">
          <div className="flex-col">
            <p className="text-[12px]"></p>
            <div className="flex items-center">
              <p className="text-[14px] font-medium">{t("adminRemoveMission")}</p>
            </div>
          </div>
        </div>
        <div>
          <Arrow className="w-[25px] h-[25px]" />
        </div>
      </div>

			{modalIsOpen && (
        <>
          <div className="fixed inset-0 bg-myColors-400 flex justify-center items-center z-50">
            <div className="bg-myColors-400 rounded-lg w-full max-w-lg h-[100vh] overflow-y-auto">
								<div className="flex justify-end px-5 mt-1">
									<Close className="w-[30px] cursor-pointer" onClick={() => setModalIsOpen(false)} />
								</div>

								<div className="p-5">
								  <p className="text-xl font-medium mb-4 text-center">{t("adminRemoveMission")}:</p>
									
									<div className="mt-3">
									{missions
											.filter((mission) => mission.icon_type !== 'Friend' && mission.icon_type !== 'Welcome')
											.map((mission) => (
												<div className={`flex justify-between mt-2 items-center text-sm py-2 px-2 border-opacity-0 text-white bg-myColors-350 rounded-xl h-[60px]`} key={mission.id}>
													<div className='flex gap-5 items-center ml-2'>
														<GetIcon icon={mission.icon_type} width={30} />
														<div className='flex-col'>
															<p className='text-[12px]'>{mission.name}</p>
															<div className='flex items-center'>
																<Coin className='w-[25px] h-[25px]' />
																<p className='text-[14px] font-medium'>+{mission.reward}</p>
															</div>
														</div>
													</div>
													<div>
														<Delete className='w-[30px] h-[25px]' onClick={() => handleRemove(mission.id)} />
													</div>
												</div>
										))}
									</div>
								</div>
					  </div>
					</div>
				</>
			)}
		</>
	)
}

export default RemoveMissions