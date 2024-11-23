import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { animated, useSpring } from 'react-spring'
import AnimatedNumber from '../../../hooks/animatedNumber'
import { useNecessary } from '../../../hooks/necessary'
import { buildings } from '../../../models/buildings'
import useApi from '../../../requestProvider/apiHandler'
import Arrow from '../../images/ArrowCity.svg'
import { ReactComponent as Coin } from '../../images/homepage/coin.svg'
import Lock from '../../images/homepage/Lock.svg'
import buildState from '../../store/buildState'
import useStore from '../../store/zustand'
import BuyBuildingModal from './BuyBuildingModal'
import CityBuildingFilter from './Filter'
import { GetIcon } from './GetIcons'

interface SwipeUpPanelProps {
  height?: string
}

const SwipeUpPanel: React.FC<SwipeUpPanelProps> = ({ height = '78vh' }) => {
  const [open, setOpen] = useState(false)
  const [visibleHeight, setVisibleHeight] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<string>('East')
  const navigate = useNavigate()

  function canOpenBox(status: string | null, rankNeedToBuy: string | null): boolean {
    const rankHierarchy: (string | null)[] = [null, 'bronze', 'silver', 'gold', 'diamond'];
  
    const userRankIndex = rankHierarchy.indexOf(status); 
    const requiredRankIndex = rankHierarchy.indexOf(rankNeedToBuy);
  
    return userRankIndex >= requiredRankIndex && userRankIndex !== -1 && requiredRankIndex !== -1;
  }


  const heightValue = parseFloat(height)

  const [{ y }, api] = useSpring(() => ({ y: heightValue - parseFloat(visibleHeight) }))

  useEffect(() => {
    api.start({ y: open ? 0 : heightValue - parseFloat(visibleHeight) })
  }, [open, heightValue, visibleHeight, api])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight <= 670) {
        setVisibleHeight('42vh')
      } else if (window.innerHeight <= 770) {
        setVisibleHeight('47vh')
      } else {
        setVisibleHeight('51vh')
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const apii = useApi()
  const { buildings, total_friends } = buildState()
  const { getBuildings, getData } = useNecessary()
  const { coin_per_hour, status } = useStore()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [modalInfo, setModalInfo] = useState<buildings>()
  const { t } = useTranslation()
  const filteredBuildings = useMemo(
    () => buildings.filter((building) => building.state === filter),
    [buildings, filter]
  );

  const buyBuilding = useCallback(async () => {
    setOpenModal(false)
    await apii({
      method: 'POST',
      url: `/building/buy?building_id=${modalInfo?.id}`,
    })
    getData()
    getBuildings()
  }, [apii, modalInfo?.id, getData, getBuildings])


  return (
    <>
      <animated.div
        ref={panelRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height,
          backgroundColor: '#464646',
          borderRadius: '30px 30px 0px 0px',
          transform: y.to((y) => `translateY(${y}vh)`),
          touchAction: 'none',
        }}
      >
        <div
          ref={handleRef}
          className='h-[55px] items-center flex justify-center text-white text-2xl font-bold bg-myColors-100 gap-1'
          onClick={() => setOpen(!open)}
        >
          <img src={Arrow}
            className='absolute top-[8px] right-1 w-[35px] h-[35px]'/>
          <div className='relative'>
            <Coin className='w-[35px] h-[45px] mt-2' />
          </div>
          <p className='mt-2'>{<AnimatedNumber value={coin_per_hour} />}/h</p>
        </div>

        <CityBuildingFilter filter={filter} setFilter={setFilter}/>

        <div className={`grid grid-cols-2 gap-2 justify-items-center ${open ? 'pb-[25vh]' : 'pb-[53vh]'} w-full px-2 overflow-y-scroll overflow-x-hidden h-[calc(85vh-55px)] pt-1`}>
            {filteredBuildings.map((building, index) => (
            <div key={index} className='bg-myColors-750 flex flex-col rounded-lg w-[180px] h-[110px]'>
              <div className='flex gap-1 px-2 my-2'>
                <div className='relative'>
                {filter === 'Downtown' ?  !canOpenBox(status, building.rank_need_to_buy) && (
                   <img src={Lock} alt=""
                   className='absolute bg-black bg-opacity-75 
                   w-full h-full rounded-[6px] p-4 border border-black' />
                ) : 
                building?.friend_to_lvl_up > total_friends && (
                  <img src={Lock} alt=""
                  className='absolute bg-black bg-opacity-75 
                  w-full h-full rounded-[6px] p-4 border border-black' />
                )}
                <GetIcon iconType={building.name} />
                </div>
                <div className='flex flex-col'>
                  {building.name === 'GIS (Governors Intelligence Service)' ? (<p className='text-[10px]'>GIS</p>) : (<p className='text-[9px]'>{building.name}</p>)}
                  <p className='text-[7px] opacity-80 mt-2'>{t('cityEarnPerTime')}: <br /></p>
                  <p className='text-[8px] opacity-80 text-myColors-250'>Current {building.per_hour} GT/h</p>
                  {building.lvl < 10 ? (<p className='text-[8px] opacity-80'>lvl{building.lvl + 1} - {building.next_lvl_price}GT/h</p>) : <p className='text-[8px] opacity-80'>Maxed</p>}
                  
                </div>
              </div>
              <div className='flex w-full justify-between text-sm'>
                <p className='p-1 bg-myColors-100 w-[60px] rounded-l-lg text-center'>lvl {building.lvl}</p>
                {filter === 'Downtown' ? !canOpenBox(status, building.rank_need_to_buy) ? (
                  <button className='text-center text-[11px] bg-myColors-400 w-full p-1 rounded-r-lg' onClick={() => navigate('/premium')}>
                  Upgrade to {building?.rank_need_to_buy}
                  </button>
                ) : (
                <p
                  className='text-center bg-myColors-400 w-full p-1 rounded-r-lg'
                  onClick={() => {
                    if (building.lvl < 10) {
                      setModalInfo(building)
                      setOpenModal(true)
                    }
                  }}
                  >
                    {building.price}GT
                </p>) : 
                building?.friend_to_lvl_up > total_friends ? (
                  <p className='text-center bg-myColors-400 w-full p-1 rounded-r-lg'>
                  Invite {building?.friend_to_lvl_up} Friend
                  </p>
                  ) : (
                    <p
                    className='text-center bg-myColors-400 w-full p-1 rounded-r-lg'
                    onClick={() => {
                      if (building.lvl < 10) {
                        setModalInfo(building)
                        setOpenModal(true)
                      }
                    }}
                    >
                      {building.price}GT
                    </p>
                  )}
                </div>
            </div>
          ))}
        </div>
      </animated.div>

      {openModal && 
      <BuyBuildingModal
        setModalInfo={setModalInfo}
        modalInfo={modalInfo}
        buyBuilding={buyBuilding}
        setOpenModal={setOpenModal}
      />}
    </>
  )
}

export default memo(SwipeUpPanel)
