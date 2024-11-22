import { useState } from 'react'
import useLevelsStore from '../../components/store/levelState'
import useStore from '../../components/store/zustand'
import ModalOfLevel from '../../components/ui/levelpage/ModalOfLevel'
import { GetLevelsType } from './type'


export default function Levelpage() {
	const {levels} = useLevelsStore()
	const {lvl} = useStore()
	const [modalInfo, setModalInfo] = useState<GetLevelsType | null>(null)
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const handleOpenModal = (info:GetLevelsType) => {
		setModalInfo(info)
		setIsOpen(true)
	}
	
	return (
		<div className='w-full px-5 mt-10'>
			<p className='text-2xl text-white font-bold text-center'>
				Level
			</p>

			<div className='mt-5 flex flex-col gap-3'>
			{/* 0 - 5 */}
			{levels?.filter(level => level.lvl >= 1 && level.lvl <= 5).map((level, i) => (
				<button className={`w-full p-2 flex justify-between items-center text-white rounded text-lg ${lvl === level.lvl && 'bg-myColors-200'}`} key={`level-1-${i}`} onClick={()=>handleOpenModal(level)}>
					<p>Level {level?.lvl} <span style={{color:'#727272'}}>({level?.reward} GT)</span> - {level?.locations} locations</p>
					<div className='w-[40px] h-[40px] bg-black rounded-full flex justify-center items-center text-xl'>
						?
					</div>
				</button>
			))}
		{/* 6 - 7 */}
		<p className='text-xl text-myColors-250'>
		🟤 <span className='font-bold'>Bronze</span>  Required
		</p>
		{levels?.filter(level => level.lvl >= 6 && level.lvl <= 7).map((level, i) => (
			<button className={`w-full p-2 flex justify-between items-center text-white rounded text-lg ${lvl === level.lvl && 'bg-myColors-200'}`} key={`level-6-7-${i}`} onClick={()=>handleOpenModal(level)}>
				<p>Level {level?.lvl} <span style={{color:'#727272'}}>({level?.reward} GT)</span> - {level?.locations} locations</p>
				<div className='w-[40px] h-[40px] bg-black rounded-full flex justify-center items-center text-xl'>
					?
				</div>
			</button>
  	))}
		{/* 8 - 9 */}
		<p className='text-xl text-myColors-250'>
		⚪ <span className='font-bold'>Silver</span>  Required
		</p>
		{levels?.filter(level => level.lvl >= 8 && level.lvl <= 9).map((level, i) => (
			<button className={`w-full p-2 flex justify-between items-center text-white rounded text-lg ${lvl === level.lvl && 'bg-myColors-200'}`} key={`level-8-9-${i}`} onClick={()=>handleOpenModal(level)}>
				<p>Level {level?.lvl} <span style={{color:'#727272'}}>({level?.reward} GT)</span> - {level?.locations} locations</p>
				<div className='w-[40px] h-[40px] bg-black rounded-full flex justify-center items-center text-xl'>
					?
				</div>
			</button>
		))}
		{/* 10 */}
		<p className='text-xl text-myColors-250'>
		🟡 <span className='font-bold'>Gold</span>  Required
		</p>
		{ levels?.filter(level => level.lvl === 10).map((level, i) => (
			<button className={`w-full p-2 flex justify-between items-center text-white rounded text-lg ${lvl === level.lvl && 'bg-myColors-200'}`} key={`level-10-${i}`} onClick={()=>handleOpenModal(level)}>
				<p>Level {level?.lvl} <span style={{color:'#727272'}}>({level?.reward} GT)</span> - {level?.locations} locations</p>
				<div className='w-[40px] h-[40px] bg-black rounded-full flex justify-center items-center text-xl'>
					?
				</div>
			</button>
			))
		}
			</div>
			{isOpen && <ModalOfLevel setIsOpen={setIsOpen} modalInfo={modalInfo}/>}
		</div>
	)
}