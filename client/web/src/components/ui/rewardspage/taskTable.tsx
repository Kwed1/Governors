import { initUtils } from '@tma.js/sdk'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { missions } from '../../../models/missions'
import useApi from '../../../requestProvider/apiHandler'
import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as Completed } from '../../images/Completed.svg'
import { ReactComponent as Coin } from '../../images/homepage/coin.svg'
import boost from '../../images/rewardspage/boost.png'
import { ReactComponent as Close } from '../../images/rewardspage/close.svg'
import { ReactComponent as Discord } from '../../images/rewardspage/discord.svg'
import friends from '../../images/rewardspage/friends.png'
import { ReactComponent as Instagram } from '../../images/rewardspage/instagram.svg'
import { ReactComponent as Telegram } from '../../images/rewardspage/telegram.svg'
import { ReactComponent as TikTok } from '../../images/rewardspage/tiktok.svg'
import { ReactComponent as Twitter } from '../../images/rewardspage/twitter.svg'
import { ReactComponent as Welcome } from '../../images/rewardspage/welcome.svg'
import { ReactComponent as Youtube } from '../../images/rewardspage/youtube.svg'
import useData from '../../store/dataState'
import useStore from '../../store/zustand'

interface iconProps {
  icon: string;
  width: number;
}

export const GetIcon = ({ icon, width }: iconProps) => {
  switch (icon) {
    case 'Welcome':
      return <Welcome className={`w-[${width}px]`} />;
    case 'Youtube':
      return <Youtube className={`w-[${width}px]`} />;
    case 'Instagram':
      return <Instagram className={`w-[${width}px]`} />;
    case 'Discord':
      return <Discord className={`w-[${width}px]`} />;
    case 'Telegram':
      return <Telegram className={`w-[${width}px]`} />;
    case 'Tiktok':
      return <TikTok className={`w-[${width}px]`} />;
    case 'X':
      return <Twitter className={`w-[${width}px]`} />;
    case 'Boost':
      return <img src={boost} className={`w-[${width}px]`} />;
    case 'Friend':
      return <img src={friends} alt='friends' className={`w-[${width}px]`} />;
    default:
      return null;
  }
};

const TaskTable = () => {
  const { missions, updateMissions } = useData()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [verifying, setVerifying] = useState<boolean>(false)
  const navigate = useNavigate()
  const api = useApi()
  const {getAccessToken} = useStore()

  interface infoTaskModal {
    id: string;
    name: string;
    reward: number;
    link: string;
    status: string;
    icon_type: string;
  }

  const [infoForModal, setInfoForModal] = useState<infoTaskModal>({
    id: '',
    name: '',
    reward: 0,
    link: '',
    status: '',
    icon_type: '',
  });

  const getMissions = async ():Promise<void> => {
    const token = getAccessToken()
		if (!token) return
		const res = await api<missions[]>({
			url: '/mission/get-user-missions',
			method: 'GET'
		})
		if (res) {
		  updateMissions(res)
      if (openModal) {
        const updatedMission = res.find(mission => mission.id === infoForModal.id);
        if (updatedMission) {
          setInfoForModal({
            id: updatedMission.id,
            name: updatedMission.name,
            reward: updatedMission.reward,
            link: updatedMission.link,
            status: updatedMission.status,
            icon_type: updatedMission.icon_type
          });
        }
      }
		}
	}

  const startMission = async (id: string) => {
    await api({
      method: 'POST',
      url: `/mission/navigate?id=${id}`
    });
    getMissions();
  };

  const checkMission = async (id: string) => {
    setVerifying(true);
    try {
      await api({
        method: 'POST',
        url: `/mission/check?id=${id}`,
      });
      await getMissions();
      setVerifying(false);
    } catch (e) {
      console.log(e);
      setVerifying(false);
    }
  };

  const claimMission = async (id: string) => {
    await api({
      method: 'POST',
      url: `/mission/claim?id=${id}`,
    });
    getMissions();
  };

  interface statusProps {
    status: string;
    id: string;
    link: string;
    type: string;
  }

  const GetStatus = ({ status, id, link, type }: statusProps) => {
    const utils = initUtils()
    const handleButtonClick = async (id: string) => {
      try {
        if (type === 'Telegram') {
          utils.openTelegramLink(link);
          await startMission(id);
        } else if (type === 'Friend') {
          navigate('/friends');
        } else {
          utils.openLink(link);
          await startMission(id);
        }
        getMissions();
      } catch (error) {
        console.error('Error verifying reward', error);
      }
    };

    switch (status) {
      case 'Open':
        return (
          <div>
            <div
              className='w-[320px] h-[45px] flex items-center justify-center bg-myColors-500 rounded-2xl text-sm font-medium cursor-pointer'
              onTouchStart={() => handleButtonClick(id)}
            >
              <p>Subscribe</p>
            </div>
          </div>
        );
      case 'Execution':
        return (
          <>
            {verifying ? (
              <p className='text-xl text-center font-medium px-5'>Checking if the task is completed, <br /> please wait</p>
            ) : (
              <div
                className='w-[320px] h-[45px] flex items-center justify-center bg-myColors-500 rounded-2xl text-sm font-medium cursor-pointer'
                onTouchStart={() => checkMission(id) }
              >
                <p>Check</p>
              </div>
            )}
          </>
        );
      case 'Verified':
        return (
          <div
            className='w-[320px] h-[45px] flex items-center justify-center bg-myColors-500 rounded-2xl text-sm font-medium cursor-pointer'
            onTouchStart={() => claimMission(id)}
          >
            <p className='font-medium'>Claim</p>
          </div>
        );
      case 'Completed':
        return (
          <div className='w-[320px] h-[45px] flex items-center justify-center bg-myColors-150 rounded-2xl border border-myColor-950 font-medium opacity-35'>
            <Completed />
          </div>
        );
      default:
        return null;
    }
  };

  const saveInfoForModal = (id: string, name: string, reward: number, link: string, status: string, icon_type: string) => {
    setInfoForModal({ id, name, reward, link, status, icon_type });
    setOpenModal(true);
  };

  const listVariants = {
    visible: (i:number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.4
      }
    }),
    hidden: {opacity: 0}
  }
  const handleClick = (mission:infoTaskModal) => {
    if (mission?.status !== 'Completed')
    if (mission?.icon_type === 'Friend') {
      navigate('/friends');
    } else {
      if (mission?.status) saveInfoForModal(mission.id, mission.name, mission.reward, mission.link, mission.status, mission.icon_type);
    }
  }
  return (
    <>
      <div className='h-[330px] h-md:h-[203px] h-xs:h-[135px] overflow-y-scroll'>
        {missions.map((mission, index) => (
          <motion.div key={mission.id} variants={listVariants} initial='hidden' custom={index} animate='visible'>
          <div className={`flex justify-between mt-2 items-center text-sm py-2 px-2 border-opacity-0 text-white bg-myColors-350 rounded-xl h-[60px]`}
              onTouchStart={() => {
                handleClick(mission)
              }}>
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

            <div className='flex gap-2 items-center'>
              {mission?.status === 'Completed' && <Completed className='w-[24px] h-[24px] mb-[2px]'/>}
              <Arrow
                className='w-[25px] h-[25px]'
                
              />
            </div>
          </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ y: '100%', opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ y: '100%', opacity: 1 }}
            className='fixed inset-0 z-[999] flex items-end' 
          >
            <motion.div
              initial={{ y: '100%', opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              exit={{ y: '100%', opacity: 1 }}
              className='w-full bg-myColors-100 h-[50vh] rounded-t-[30px] px-5 py-4 border-t border-myColors-700 shadow-[0_0_24px_34px_rgba(189,136,54,0.8)]'
            >
              <div className='flex justify-end'>
                <Close className='cursor-pointer w-[30px]' onTouchStart={() => setOpenModal(false)} />
              </div>
              <div className='flex flex-col justify-center items-center'>
                <p className='text-2xl w-[200px] text-center font-medium'>{infoForModal.name}</p>
                <div className='w-[120px]'>
                  <GetIcon icon={infoForModal.icon_type} width={120} />
                </div>
                <div className='flex mt-3 items-center gap-2 w-full justify-center'>
                  <Coin className='w-[40px] h-[40px] z-10' />
                  <p className='text-2xl font-bold relative z-10 mb-1'>+{infoForModal.reward}</p>
                </div>
                <div className='absolute bottom-5'>
                  <GetStatus status={infoForModal.status} id={infoForModal.id} link={infoForModal.link} type={infoForModal.icon_type} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TaskTable;