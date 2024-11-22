import { Dispatch, SetStateAction } from 'react'
import i18n from '../../../../18n'
import useApi from '../../../../requestProvider/apiHandler'
import { ReactComponent as Close } from '../../../images/airdrop/close.svg'
import { ReactComponent as Indonesia } from '../../../images/flags/indonesia.svg'
import { ReactComponent as Russian } from '../../../images/flags/russian.svg'
import { ReactComponent as United } from '../../../images/flags/united.svg'
interface Props {
	setModalLanguage: Dispatch<SetStateAction<boolean>>
}
export default function LanguageModal({setModalLanguage}:Props) {
	const api = useApi()
		
  const changeLanguageAPI = async(culture: string) => {
    const res = await api({
      method: 'PATCH',
      url: `/identity/change_language?culture=${culture}`
    })
  }

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    changeLanguageAPI(lang)
		setModalLanguage(false)
  }
  

	return (
		<div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-white transition-opacity duration-300 ease-in-out`}>
      <div
        className={`bg-myColors-800 border border-myColors-850 rounded-[35px] py-2 pb-4 px-4 md:max-w-md mx-2 z-60 transform w-[350px] transition-transform duration-300 ease-in-out $`}
      >
        <div className='flex justify-end'>
        <Close className='w-[25px]' onClick={() => setModalLanguage(false)}/>
        </div>
        
				<p className='text-center'>Click on the language</p>
				<div className='flex justify-center gap-5 items-center pb-1 mt-5'>
					<United className='w-[25px]' onClick={() => changeLanguage('en')} />
					<Russian className='w-[25px]' onClick={() => changeLanguage('ru')} />
					<Indonesia className='w-[25px]' onClick={() => changeLanguage('id')}/>
        </div>

      </div>
      </div>
	)
}