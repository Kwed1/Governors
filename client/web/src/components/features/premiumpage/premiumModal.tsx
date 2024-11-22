import { invoice } from '@telegram-apps/sdk'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { GetPremiumPackagesInt } from '../../../pages/premiumpage/types/PremiumPackagesInt'
import Close from '../../images/airdrop/close.svg'
import useInvoiceApi from './api/getInvoice'
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  modalInfo: GetPremiumPackagesInt
}

export default function PremiumModal({ isOpen, setIsOpen, modalInfo }: Props) {
  const [showStars, setShowStars] = useState(false);
	const [stars, setStars] = useState<number>(0);
  const closeModal = () => setIsOpen(false);
  const {getInvoiceAddress} = useInvoiceApi()

  useEffect(() => {
    if (isOpen) {
      setShowStars(true);
    }
  }, [isOpen]);

/* 	useEffect(() => {
    const userValue = modalInfo?.price
		const starCost = userValue / (0.625 / 50);

		if (!isNaN(userValue) && userValue > 0) {
			setStars(starCost);
		} else {
			setStars(0);
		}
  }, []) */
  const handleClick = async() => {
    const res = await getInvoiceAddress(modalInfo?.price)
    if (res) {
    const invoiceUrl = res.replace("https://t.me/$", "")
    console.log(invoiceUrl);
    invoice.open(invoiceUrl)
    }
  }
  const bonusItems = modalInfo?.bonus.split('/').map(item => item.trim());
  return (
    <div>
      {isOpen && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-white transition-opacity duration-300 ease-in-out`}>
        <div
          className={`bg-myColors-800 border border-myColors-850 rounded-[35px] py-2 pb-4 px-4 md:max-w-md mx-2 z-60 transform w-[350px] transition-transform duration-300 ease-in-out`}
        >
          <div className='flex justify-end'>
            <button className='w-[30px] h-[30px] flex justify-center items-center' onClick={() => setIsOpen(false)}>
              <img src={Close} alt="" className='w-[30px] h-[30px]' />
            </button>
          </div>
          <p className='text-center font-bold text-xl'>
          {modalInfo?.name} Membership <br/> {modalInfo?.price}⭐
          </p>        
          <div className='flex justify-center flex-col mt-5 px-10'>
            {bonusItems.map((bonus, index) => (
              <p key={index}>- {bonus}</p>
            ))}
          </div>
          <div className='flex gap-5 justify-center items-center mt-10'>
            <button
              className='p-2 px-4 bg-myColors-500 font-bold w-[130px] rounded-3xl'
              style={{ boxShadow: '0 4px 25px rgba(247, 174, 59, 1)' }}
              onClick={handleClick}
            >
              BUY
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}