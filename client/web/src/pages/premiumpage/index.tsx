import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PremiumModal from '../../components/features/premiumpage/premiumModal'
import Arrow from '../../components/images/arrow.svg'
import { ReactComponent as ArrowRight } from '../../components/images/arrowRight.svg'
import CrownIcon from '../../components/images/header/crown.svg'
import usePackageStore from '../../components/store/packagesState'
import { GetPremiumPackagesInt } from './types/PremiumPackagesInt'

export const PremiumPage = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const {packages} = usePackageStore()
	const [modalInfo, setModalInfo] = useState<GetPremiumPackagesInt>()

	const handleClick = (packageInfo: GetPremiumPackagesInt) => {
		setModalInfo(packageInfo)
		setIsOpen(true)
	}

	const getFlagComponent = (name:string) => {
    switch (name) {
      case 'Gold': return <p className='text-xl'>🟡</p>
      case 'Bronze': return <p className='text-xl'>🟤</p>
      case 'Silver': return <p className='text-xl'>⚪</p>
      case 'Diamond': return <p className='text-xl'>💎</p>
			default: return null
    }
  };
	const navigate = useNavigate()

	return (
		<div className='w-full px-5 mt-[11vh]'>
			<ArrowRight className='w-[30px] rotate-180 mt-5' style={{fill: 'white'}} onClick={() => navigate(-1)}/>
			<div className='flex flex-col items-center'>
				<img src={CrownIcon} alt="" />
				<p className='text-center text-2xl font-bold text-myColors-250'>
					Premium
				</p>
			</div>

			<div className='flex flex-col gap-3 mt-5 font-bold text-white'>
				{packages?.map((pack, i) => (
					<button className='w-full px-3 bg-myColors-200 p-3 rounded-md flex justify-between items-center h-[46px]' 
					onClick={()=>handleClick(pack)}>
					<div className='flex gap-1 items-center'>
						{getFlagComponent(pack.name)}
						<p className='text-sm'>{pack.name} - {pack?.price}⭐</p>
					</div>
					{pack.discount !== 0 && <p className='text-sm font-light text-myColors-250'>Discount {pack?.discount}%</p>}
					<img src={Arrow} alt='arrow' className='w-[23px] h-[23px] pt-[2px]'/>
					</button>
				))}
			</div>
	
			{isOpen && modalInfo && <PremiumModal isOpen={isOpen} setIsOpen={setIsOpen} modalInfo={modalInfo} />}
		</div>
	)
}

export default PremiumPage