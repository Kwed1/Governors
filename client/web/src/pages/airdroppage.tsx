import { useTonAddress, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as Arrow } from '../components/images/airdrop/arrow.svg'
import { ReactComponent as Close } from '../components/images/airdrop/close.svg'
import { ReactComponent as Delete } from '../components/images/airdrop/delete.svg'
import modalwallet from '../components/images/airdrop/modalwallet.png'
import wallet from '../components/images/airdrop/wallet.png'
import { ReactComponent as Coin } from '../components/images/homepage/coin.svg'
const Airdroppage: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [status, setStatus] = useState<string>('')

  const {t} = useTranslation()
  const [tonConnectUI] = useTonConnectUI();
  const isWalletConnected = useTonWallet()
  const userFriendlyAddress = useTonAddress();

  useEffect(() => {
    setOpenModal(false)
  }, [isWalletConnected])
  
  const handleConnectWallet = async () => {
    try {
      await tonConnectUI.connectWallet();
      console.log("Wallet connected successfully");
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await tonConnectUI.disconnect();
      console.log("Wallet disconnected successfully");
      setStatus('');
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const changeStatus = (status: string) => {
    setOpenModal(true)
    setStatus(status)
  }

  return (
    <>
    <div className={`fixed w-full h-[78vh] bg-myColors-100 rounded-t-[30px] bottom-0 `}>
      
        <div className='h-[50px] items-center flex justify-center text-white text-2xl font-bold bg-myColors-100 rounded-t-[30px] gap-2'>
          <p className='mb-1'>{t('airdrop')}</p>
        </div>


      <div className='h-full p-5 text-white bg-myColors-450'>
        <div className='flex flex-col items-center justify-center relative'>
          <div className='w-[140px] h-[90px] rounded-full bg-myColors-500 blur-2xl absolute top-10' />
          <Coin className='w-[170px] h-[170px] z-10' />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }} 
        >
          <p className='text-center text-[13px] mt-5' dangerouslySetInnerHTML={{ __html: t('airdropDescr') }} />
        </motion.div>

        <div className='mt-5'>
          <p className='font-medium'>{t('airdropTasklist')}</p>
          {isWalletConnected !== null ? (
            <>
             <div className='w-full bg-myColors-350 p-2 rounded-lg flex items-center mt-3 justify-between' onClick={() => changeStatus('connected')}>
             <div className='flex items-center gap-2'>
                <img src={wallet} className='w-[30px] h-[30px] mb-1' />
                <p className='text-[13px] font-medium'>{t("airdropConneddWallet")}</p>
              </div>

              <div><Arrow className='h-[25px] pt-[1px]'/></div>
             </div>
            </>
          ) : 
          <>
            <div className='w-full bg-myColors-500 p-2 rounded-lg flex items-center mt-3 justify-between'  onClick={() => changeStatus('')}>
              <div className='flex items-center gap-2'>
                <img src={wallet} className='w-[30px] h-[30px] mb-1' />
                <p className='text-[13px] font-medium'>{t("airdropConWallet")}</p>
              </div>

              <div><Arrow className='h-[25px] pt-[1px]'/></div>
            </div>
          </>
          }
        </div>
        </div>
      </div>

      <AnimatePresence>
      {openModal && (
        <>
        <motion.div initial={{ y: '100%', opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }} 
          className='fixed bottom-0 w-full bg-myColors-100 h-[60vh] left-0 z-[999] rounded-t-[30px] px-5 py-4'>
						<div className='flex justify-end'>
						<Close className='w-[40px] h-[40px]' onClick={() => setOpenModal(false)}/>
						</div>
            <div className='flex justify-center flex-col items-center'>
              <img src={modalwallet} className='w-[130px] h-[130px] mb-1' />
              {status === 'connected' ? (
                <>
                  <p className='font-bold text-lg text-center leading-5 text-white' dangerouslySetInnerHTML={{ __html: t('airdropConedWallet') }}> 
                  
                  </p>

                  <div className='text-sm text-center text-white mt-4'>
                     {t('airdropCopy')}
                  </div>

                  <div className='flex mt-10 justify-between w-full items-center'>
                    <div className='p-1 border rounded-lg h-[35px] w-[40px] flex items-center justify-center' onClick={() => handleDisconnectWallet()}>
                      <Delete className='w-[20px] h-[20px]'/>
                    </div>

                    <div className='border rounded-lg w-full ml-10 h-[35px] flex items-center'>
                    <input type="text" className='w-full px-1 bg-transparent text-white outline-none' readOnly value={userFriendlyAddress} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className='font-bold text-lg text-center leading-5 text-white' 
                  dangerouslySetInnerHTML={{ __html: t('airdropModalTitle') }}
                  >
                  </p>

                  <div 
                    className='text-sm text-center text-white mt-4'>
                  {t('airdropDescrModal')}
                  </div>

                  <div className='w-full bg-myColors-500 p-3 rounded-lg flex items-center mt-5 justify-center'  onClick={() => handleConnectWallet()}>
                    <p className='text-sm text-white font-medium'>{t('airdropConWalletModal')}</p>
                  </div>

                </>
              )}
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </>
  );
};

export default Airdroppage;
