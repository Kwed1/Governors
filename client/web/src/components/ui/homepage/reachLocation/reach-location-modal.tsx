import { Dispatch, SetStateAction } from 'react'
import Close from '../../../images/airdrop/close.svg'
import Box from '../../../images/homepage/box.svg'
import Lock from '../../../images/homepage/Lock.svg'
import Unlock from '../../../images/homepage/unlock.svg'
import { gameCount } from './reach-location'
interface Props {
	setModalOfReach: Dispatch<SetStateAction<boolean>>
	handleClick: () => void
  count: gameCount | undefined,
  close: boolean
}
export default function ReachLocationModal({setModalOfReach, count, close}:Props) {
	const handleClick = () => {
		console.log(123);
	}
	return (
		<div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-white transition-opacity duration-300 ease-in-out`}>
        <div
          className={`bg-myColors-800 rounded-[35px] p-5 pb-10 md:max-w-md mx-2 z-60 transform w-[350px] transition-transform duration-300 ease-in-out`}
        >
          <div className='flex justify-end'>
            <button className='w-[30px] h-[30px] flex justify-center items-center'
						onClick={() => setModalOfReach(false)}>
              <img src={Close} alt="" className='w-[22px] h-[22px]' />
            </button>
          </div>
					<p className='text-center font-bold text-[24px] text-myColors-250'>
						Limited Gifts
					</p>
          {close ? (
          <div className='flex justify-center mt-5'>
            <img src={Lock} className='w-[24px] h-[24px]' />
          </div>
          ) : (
          <>
          <div className='flex justify-center mt-5'>
            <img src={Unlock} className='w-[24px] h-[24px]' />
          </div>
					<p className='text-center text-3xl font-bold mt-2'>
						{count?.placeCount}/{count?.total}
					</p>
					<p className='text-center text-[10px] text-myColors-250'>
						You get {count?.gameReward} GT
					</p>
          </>
          )}
          <div className='flex justify-center flex-col items-center'>
            <img src={Box} alt="" className='w-[170px] h-[170px]' />
						<p className='opacity-25 text-[18px]'>Gifts Appear Randomly</p>
          </div>
	
          <div className='flex gap-5 justify-center items-center mt-10'>
            <button
              className={`p-2 px-4 bg-myColors-500 font-bold w-[130px] rounded-3xl ${close && 'opacity-55'}`}
              style={{ boxShadow: '0 4px 25px rgba(247, 174, 59, 1)' }}
              onClick={handleClick}
            >
              Reedem
            </button>
          </div>
        </div>
      </div>
	)
}