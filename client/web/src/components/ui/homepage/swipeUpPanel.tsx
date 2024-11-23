import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSpring } from 'react-spring'
import { useNecessary } from '../../../hooks/necessary'
import SuccessSnackbar from '../../../hooks/successSnackbar'
import { GameData } from '../../../models/gameData'
import ErrorSnackbar from '../../../requestProvider/errorSnackbar'
import useStore from '../../store/zustand'
import Map from './Map/Map'

interface SwipeUpPanelProps {
  height?: string
  visibleHeight?: string
}

const SwipeUpPanel: React.FC<SwipeUpPanelProps> = ({ height = '85vh', visibleHeight = '65vh' }) => {

  const heightValue = parseFloat(height)
  const visibleHeightValue = parseFloat(visibleHeight)

  const [{ y }, api] = useSpring(() => ({ y: heightValue - visibleHeightValue }))


  const { t } = useTranslation()
  const { getAccessToken, accessToken } = useStore()
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [close, setClose] = useState<boolean>(false)
  const [gameData, setGameData] = useState<GameData[]>([])
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    api.start({ y: open ? 0 : heightValue - visibleHeightValue })
  }, [open, heightValue, visibleHeightValue, api])

  useEffect(() => {
    const token = getAccessToken()

    if (!token) {
      console.error('No token found')
      return
    }

    const ws = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/offline_ws?token=${token}`)
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'getInitialData' }))
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log(data)
        if (data.claimed !== undefined) {
          if (data.claimed === true) {
            ws.send(JSON.stringify({ type: 'getInitialData' }))
          }
        }
        else {
          if (Array.isArray(data)) {
            setGameData(data)
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed')
    }

    setSocket(ws)

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [getAccessToken])

  const { getData } = useNecessary()

  const handleClick = (id: string) => {
    if (socket) {
      socket.send(JSON.stringify({ type: `offlineGame/${id}` }))
    }
    getData()
    setMessage(t('snackbarSuccess'))
    setTimeout(() => {
      setMessage('')
    }, 2000)
  }

  return (
    <>
      <div className='bottom-0 w-full fixed max-h-[81vh] custom-sm:h-[78vh]'>
          {/* <div
            className='absolute top-[4px] left-[42%] right-0 h-[3px] w-[70px] bg-myColors-300 rounded-full'></div> */}
        <div className='h-full'>
          <Map gameData={gameData} handleClick={handleClick} setError={setError} open={open} />
        </div>
      </div>
      <SuccessSnackbar message={message} />
      <ErrorSnackbar error={error} onClose={() => setError('')} />
    </>
  )
}

export default memo(SwipeUpPanel)
