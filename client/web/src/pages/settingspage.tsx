import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import i18n from '../18n'
import LanguageModal from '../components/features/settings/language/language-modal'
import { ReactComponent as Close } from '../components/images/airdrop/close.svg'
import { ReactComponent as Arrow } from '../components/images/arrow.svg'
import { ReactComponent as ArrowRight } from '../components/images/arrowRight.svg'
import { ReactComponent as Indonesia } from '../components/images/flags/indonesia.svg'
import { ReactComponent as Russian } from '../components/images/flags/russian.svg'
import { ReactComponent as United } from '../components/images/flags/united.svg'
import Crown from '../components/images/header/crown.svg'
import '../components/ui/background.css'
import { useTelegram } from '../hooks/useTelegram'
import useApi from '../requestProvider/apiHandler'
const Settingspage = () => {
	const [openModal, setOpenModal] = useState<boolean>(false)
	const [modalLanguage, setModalLanguage] = useState<boolean>(false)
	const {onClose} = useTelegram()
	const api = useApi()

	const deleteAccount = async() => {
		const res = await api({
			url: `/identity/delete-account`,
			method: 'DELETE'
		})
		onClose()
	}

	const navigate = useNavigate()

	const {t} = useTranslation()


  const currentLanguage = i18n.language;

  const getFlagComponent = () => {
    if (currentLanguage === 'ru') {
      return <Russian className='w-[25px]' />;
    } else if (currentLanguage === 'en') {
      return <United className='w-[25px]' />;
    } else {
      return <Indonesia className='w-[25px]' />;
    }
  };
  
  const CurrentFlag = getFlagComponent();

	return (
		<>
		  <div className='backgroundSettings'/>
			<div className="flex flex-col justify-center items-center mt-[11vh]">
			  
				<div className='max-w-[350px] w-full text-white'>
				<ArrowRight className='w-[30px] rotate-180 mt-5' style={{fill: 'white'}} onClick={() => navigate(-1)}/>

			  <div className=''>
				  <p className='text-white text-2xl font-bold text-center w-full'>{t('settings')}</p>
				</div>

				<button className='mt-10 px-3 bg-myColors-200 p-3 rounded-md flex justify-between items-center h-[46px] w-full'
				onClick={() => setModalLanguage(true)}>
					<p className='text-sm'>Language</p>
					{CurrentFlag}
				</button>

				<button className='w-full mt-2 px-3 bg-myColors-200 p-3 rounded-md flex justify-between items-center h-[46px]'
				onClick={() =>navigate('/premium')}>
					<div className='flex items-center gap-1'>
						<p className='text-myColors-250 text-sm'>
							Upgrade Premium
						</p>
						<img src={Crown} 
						className='w-[20px] h-[20px]' 
						alt="Crown" />
					</div>
					<Arrow className='w-[23px] h-[23px] pt-[2px]'/>
				</button>

				<button className='w-full mt-2 px-3 bg-myColors-200 p-3 rounded-md flex justify-between items-center h-[46px]' onClick={() => setOpenModal(true)}>
					<p className='text-sm'>{t('deleteAccount')}</p>
					<Arrow className='w-[23px] h-[23px] pt-[2px]'/>
				</button>

				</div>
			</div>

			{modalLanguage && <LanguageModal setModalLanguage={setModalLanguage}/>}

			{openModal && (
      <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-white transition-opacity duration-300 ease-in-out`}>
      <div
        className={`bg-myColors-800 border border-myColors-850 rounded-[35px] py-2 pb-4 px-4 md:max-w-md mx-2 z-60 transform w-[350px] transition-transform duration-300 ease-in-out $`}
      >
        <div className='flex justify-end'>
        <Close className='w-[25px]' onClick={() => setOpenModal(false)}/>
        </div>
        <p className='text-center font-bold text-xl'>{t('deleteAccount')}</p>
        <p className='text-center mt-5'>
				{t('confirmDeleteAcc')}
        </p>
				<p className='text-[9px] text-center mt-2'>
				{t('deleteAccDesc')}</p>
        <div className='flex gap-5 justify-center items-center mt-10'>
          <button className='p-2 px-4 bg-myColors-500 font-medium w-[130px] rounded-3xl' style={{ boxShadow: '0 4px 25px rgba(247, 174, 59, 1)' }} onClick={() => deleteAccount()}>{t('delete')}</button>
        </div>
      </div>
      </div>
    )}
		</>
	)
}

export default Settingspage