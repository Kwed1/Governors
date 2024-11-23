import { initUtils } from '@tma.js/sdk'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { formatDateString } from '../../../../hooks/convertDate'
import { useNecessary } from '../../../../hooks/necessary'
import SuccessSnackbar from '../../../../hooks/successSnackbar'
import { GameData } from '../../../../models/gameData'
import CrownIcon from '../../../images/homepage/crown.svg'
import { getDistance, UpdateMapCenter } from '../../../utils/mapUtils'
import ReachLocation from '../reachLocation/reach-location'
import { LocationInfo } from '../type'
import ClaimLocationModal from './ClaimLocationModal'
import GetPointsApi from './generateLocations/api/get-points'
import GenerateLocations from './generateLocations/generate-locations'
import './map.css'

interface Props {
  gameData: GameData[]
  handleClick: (closeid: string) => void
  setError: any
  open: boolean
}

export interface ModalInfoInt {
  diamonds: number,
  reward:number
}

interface Marker {
  name: string
  position: [number, number]
  showClick: boolean
  placeCount: number
  total: number
  diamond_reward?: number,
  game_reward: number
  id: string
  start_at: string
}

const createCustomIcon = (text: string) => {
  return L.divIcon({
    html: `
      <div class="royal-marker">
        <img src="${CrownIcon}" alt="Marker" style="width: 70%; height: 80%; border-radius: 50%;" />
        <div class="marker-text text-myColors-250">${text}</div>
      </div>
    `,
    className: '',
    iconSize: [25, 25],
  });
};


function Map({ gameData, handleClick, setError }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [generatedPoints, setGeneratedPoints] = useState<Marker[]>([])
  const { t } = useTranslation()
  const once = useRef(false)
  const {getData} = useNecessary()
  const [message, setMessage] = useState<string>('')
  const [ClaimModal, setClaimModal] = useState<boolean>(false)
  const [modalInfo, setModalInfo] = useState<ModalInfoInt>({
    reward: 0,
    diamonds: 0
  })
  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    claimed_count: 0,
    generate_chance: 0,
    claimed_need_to_reward: 0,
    generate_max_chanced: 0,
    virtual_picks: 0,
    reward: 0
  })

  const { setPoints, claimLocation, getPoints, claimVirtual} = GetPointsApi()

  const getPointsReq = async () => {
    if (position) {
      const res = await setPoints(position[0], position[1]);
      if (res) {
        setGeneratedPoints(res.points.map(res => {
          const markerPosition: [number, number] = [res.latitude, res.longitude];
          const distanceToMarker = getDistance(position, markerPosition);
          return {
            name: 'generated',
            position: markerPosition,
            showClick: distanceToMarker <= 100,
            placeCount: 0,
            total: 0,
            diamond_reward: res?.diamond_reward,
            game_reward: res.reward,
            id: res.id,
            start_at: ''
          };
        }));
        setLocationInfo({
          claimed_count: res?.claimed_count,
          generate_chance: res.generate_chance,
          generate_max_chanced: res.generate_max_chanced,
          claimed_need_to_reward: res.claimed_need_to_reward,
          virtual_picks: res.virtual_picks,
          reward: res.reward
        });
      }
    }
  };
  
  const getPointsRes = async () => {
      const res = await getPoints();
      if (res && position) {
        setGeneratedPoints(res.points.map(point => {
          const markerPosition: [number, number] = [point.latitude, point.longitude];
          const distanceToMarker = getDistance(position, markerPosition);
  
          return {
            name: 'generated',
            position: markerPosition,
            showClick: distanceToMarker <= 100,
            placeCount: 0,
            total: 0,
            diamond_reward: point?.diamond_reward,
            game_reward: point.reward,
            id: point.id,
            start_at: ''
          };
        }));
        setLocationInfo({
          claimed_count: res.claimed_count,
          generate_chance: res.generate_chance,
          generate_max_chanced: res.generate_max_chanced,
          claimed_need_to_reward: res.claimed_need_to_reward,
          virtual_picks: res.virtual_picks,
          reward: res.reward
        });
    }
  };

  useEffect(() => {
    if (!once.current && position) {
      getPointsRes()
      once.current = true
    }
  }, [position])

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPosition: [number, number] = [latitude, longitude];
        setPosition(newPosition);
  
        const updatedMarkers = gameData.map((data) => {
          const markerPosition: [number, number] = [data.geolocation_x, data.geolocation_y];
          const distanceToMarker = getDistance(newPosition, markerPosition);
          return {
            name: '',
            position: markerPosition,
            showClick: distanceToMarker <= 100,
            placeCount: data.place_count,
            total: data.total,
            game_reward: data.game_reward,
            id: data.id,
            start_at: data.start_at,
          };
        }).filter((marker): marker is Marker => marker !== null);
  
        setMarkers(updatedMarkers);
  
        setGeneratedPoints((prevPoints) =>
          prevPoints.map((point) => {
            const distanceToGeneratedMarker = getDistance(newPosition, point.position);
            return {
              ...point,
              showClick: distanceToGeneratedMarker <= 100,
            };
          })
        );
      },
      console.error,
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [gameData]);

  const claimGeneratedVirtual = async (id: string,reward:number, diamond:number) => {
    if (position) {
    const res = await claimVirtual(id)
    getData()
    if (res) {
      setModalInfo({
        reward: reward,
        diamonds: diamond
      })
      setClaimModal(true)
      setMessage(t('snackbarSuccess'))
      setTimeout(() => {
        setMessage('')
      }, 2000)
      setGeneratedPoints(res.points.map(point => {
        const markerPosition: [number, number] = [point.latitude, point.longitude]
        const distanceToMarker = getDistance(position, markerPosition)
        return {
          name: 'generated',
          position: markerPosition,
          showClick: distanceToMarker <= 100,
          placeCount: 0,
          total: 0,
          game_reward: 0,
          diamond_reward: point?.diamond_reward,
          id: point.id,
          start_at: ''
        }
      }))
      setLocationInfo({
        claimed_count: res.claimed_count,
        generate_chance: res.generate_chance,
        generate_max_chanced: res.generate_max_chanced,
        claimed_need_to_reward: res.claimed_need_to_reward,
        virtual_picks: res.virtual_picks,
        reward: res.reward
      })
    }
  }
  }

  const claimGenerated = async (id: string,reward:number, diamond:number) => {
    if (position) {
    const res = await claimLocation(id)
    getData()
    if (res) {
      setModalInfo({
        reward: reward,
        diamonds: diamond
      })
      setClaimModal(true)
      setMessage(t('snackbarSuccess'))
      setTimeout(() => {
        setMessage('')
      }, 2000)
      setGeneratedPoints(res.points.map(point => {
        const markerPosition: [number, number] = [point.latitude, point.longitude]
        const distanceToMarker = getDistance(position, markerPosition)

        return {
          name: 'generated',
          position: markerPosition,
          showClick: distanceToMarker <= 100,
          placeCount: 0,
          total: 0,
          game_reward: 0,
          diamond_reward: point?.diamond_reward,
          id: point.id,
          start_at: ''
        }
      }))
      setLocationInfo({
        claimed_count: res.claimed_count,
        generate_chance: res.generate_chance,
        generate_max_chanced: res.generate_max_chanced,
        claimed_need_to_reward: res.claimed_need_to_reward,
        virtual_picks: res.virtual_picks,
        reward: res.reward
      })
    }
  }
  }

  const combinedMarkers = [...markers, ...generatedPoints]
  const closestMarker = combinedMarkers.find(marker => marker.showClick)
  const utils = initUtils()

  
  return (
    <div className="relative">
      <div className="w-full flex flex-col justify-center items-center" style={{ position: 'relative', width: '100%' }}>
      
        <div className='absolute top-0 w-full' style={{ zIndex: 9999 }}>
          <ReachLocation locationInfo={locationInfo} />
        </div>
        <MapContainer
          center={position || [0, 0]}
          zoom={18}
          style={{ height: '800px', width: '100%', margin: '0 auto', position: 'relative' }}
          attributionControl={false}
          zoomControl={false}
        >
          <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://carto.com/">CartoDB</a> contributors'
          />
          {position && (
            <>
              <UpdateMapCenter position={position} />
              <Marker position={position} icon={L.divIcon({ className: 'user-marker' })} />
              {combinedMarkers.map((marker, index) => (
                marker.name !== 'generated' ? (
                <Marker
                  key={index}
                  position={marker.position}
                  icon={createCustomIcon(`${marker.placeCount}/${marker.total}`)}
                >
                    <Popup>
                      <p className='text-myColors-300'>{formatDateString(marker.start_at)}</p>
                      <p className='flex gap-1 text-myColors-300'>{t('adminReward')} <span className='text-myColors-250 font-bold'>{marker.game_reward === -1 ? t("claimedReward") : marker.game_reward}</span></p>
                      <button className='mt-2 bg-myColors-250 text-white font-bold px-5 p-2 rounded-xl'
                      onClick={() => utils?.openLink(`https://www.google.com/maps?q=${marker?.position[0]},${marker?.position[1]}`)}>{t('checkGooleMap')}</button>
                    </Popup>
                </Marker>
                ) : (
                  <Marker
                  key={index}
                  position={marker.position}
                  icon={L.divIcon({
                    html: `
                      <div class="custom-marker">
                        <div class="marker-icon"></div>
                      </div>
                    `,
                    className: '',
                    iconSize: [20, 20],
                  })}
                  >
                  {locationInfo?.virtual_picks && (
                    <Popup>
                      <button className='bg-myColors-250 text-white font-bold px-5 p-2 rounded-xl'
                      onClick={() => claimGeneratedVirtual(marker?.id, marker?.game_reward, marker?.diamond_reward || 0)}>
                        Claim
                      </button>
                    </Popup>
                  )}
                </Marker>
                )
              ))}
            </>
          )}
        </MapContainer>

        <div className='fixed z-[999] bottom-[105px] left-5'>
          <GenerateLocations 
            getPointsReq={getPointsReq}
            position={position}
            locationInfo={locationInfo}
          />
        </div>

        <div className={`fixed text-white z-[999] bottom-[105px]`}>
          {closestMarker && closestMarker?.game_reward !== -1 ? (
            <button
              className="w-[95px] h-[95px] p-2 bg-opacity-35 bg-black rounded-full flex items-center justify-center"
              onClick={() => closestMarker?.name === '' ? handleClick(closestMarker?.id) : claimGenerated(closestMarker.id, closestMarker?.game_reward, closestMarker?.diamond_reward || 0)}
            >
              <div className='w-full h-full p-1 bg-black rounded-full flex items-center justify-center flex-col'>
                <p className='text-center text-[14px]'>I'm here!</p>
                <p className='text-myColors-250 text-[12px]'>{closestMarker?.game_reward} GT</p>
              </div>
            </button>
          ) : (
            <div className="w-[95px] h-[95px] p-2 bg-opacity-35 bg-black rounded-full flex items-center justify-center">
              <div className='w-full opacity-35 h-full p-1 bg-black rounded-full flex items-center justify-center flex-col'>
                <p className='text-center text-[14px]'>I'm here!</p>
                <p className='text-myColors-250 text-[12px]'>{locationInfo?.reward || 0} GT</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <SuccessSnackbar message={message} />
      {ClaimModal && <ClaimLocationModal modalInfo={modalInfo} setClaimModal={setClaimModal} />}
    </div>
   
  )
}

export default Map
