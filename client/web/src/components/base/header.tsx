import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { abbreviateNumber } from '../../hooks/convertNumber'
import { useTelegram } from '../../hooks/useTelegram'
import CrownIcon from '../images/header/crown.svg'
import { ReactComponent as Settings } from '../images/header/settings.svg'
import { ReactComponent as Coin } from '../images/homepage/coin.svg'
import { ReactComponent as Logo } from '../images/logo.svg'
import useStore from '../store/zustand'
const Header = () => {
  const {t, i18n} = useTranslation()
  const navigate = useNavigate()
  const {status, balance} = useStore()
  const currentLanguage = i18n.language;

  const getFlagComponent = () => {
    switch (status) {
      case 'gold': return <p className='text-2xl'>🟡</p>
      case 'bronze': return <p className='text-2xl'>🟤</p>
      case 'silver': return <p className='text-2xl'>⚪</p>
      case 'diamond': return <p className='text-2xl'>💎</p>
      default: return <button
      className='relative rounded-2xl bg-black w-[50px] h-[45px] flex justify-center items-center bg-opacity-55 cursor-pointer'
      onClick={() => navigate('/premium')}
      >
        <img src={CrownIcon} alt="" className='h-[20px] w-[30px]' />
      </button>
    }
  };
  
  const {user} = useTelegram()
  const {coin_per_hour, lvl, diamonds} = useStore()

  return (
    <>
      <div
        className={`relative h-[19vh] custom-sm:h-[22vh] w-full opacity-55`}
        style={{backgroundColor: '#232323'}}
      >
      </div>
      <div className='absolute top-[6.5vh] w-full px-5'>
        <div className='flex w-full justify-center'>
            <div className='flex gap-1 items-center bg-myColors2-200 p-2 rounded-[30px]'>
              <button onClick={()=>navigate('/level')}>
                <Logo className='w-[35px] h-[35px]' />
              </button>

              <div className='flex flex-col text-[12px] text-white'>
                <p>@{user}</p>
                <p className='opacity-45 ml-[2px]'>{t('level')} {lvl} - {diamonds}💎</p>
              </div>
            </div>
        </div>
        <div className='flex w-full justify-center mt-2'>
          <div className='flex justify-between items-center'>
            <div className='flex gap-3 items-center rounded-2xl bg-black bg-opacity-[40%]'>
              
              <button
                className='relative rounded-2xl bg-black w-[50px] h-[45px] flex justify-center items-center bg-opacity-55 cursor-pointer'>
                  {getFlagComponent()}
                </button>

              <div className='flex flex-col text-white gap-1'>
                <div className='text-center text-[12px] flex gap-1 items-center justify-center'>
                  <Coin className='w-5 h-5' />
                    <p>{abbreviateNumber(balance)}</p>
                </div>
              </div>

              <div className='rounded-2xl bg-black w-[50px] h-[45px] flex justify-center items-center bg-opacity-55'>
                <Settings className='w-[20px]' onClick={() => navigate('/Settings')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
