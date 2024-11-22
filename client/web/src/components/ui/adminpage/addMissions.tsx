import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNecessary } from '../../../hooks/necessary'
import { addMission } from '../../../models/missions'
import useApi from '../../../requestProvider/apiHandler'
import { ReactComponent as Close } from '../../images/airdrop/close.svg'
import { ReactComponent as Arrow } from '../../images/arrow.svg'
const AddMissions = () => {
  const api = useApi()
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const {getMissions} = useNecessary()
  const [missionData, setMissionData] = useState<addMission>({
    name: '',
    type: '',
    reward: 0,
    link: '',
    icon_type: '',
    tg_channel_id: 0,
  })

  const [errors, setErrors] = useState({
    name: '',
    type: '',
    reward: '',
    link: '',
    icon_type: '',
    tg_channel_id: '',
  })

  const initialMissionData = {
    name: '',
    type: '',
    reward: 0,
    link: '',
    icon_type: '',
    tg_channel_id: 0,
  }

  const initialErrors = {
    name: '',
    type: '',
    reward: '',
    link: '',
    icon_type: '',
    tg_channel_id: '',
  }

  console.log(missionData);
  

  const onClose = () => {
    setMissionData(initialMissionData)
    setErrors(initialErrors)
    setModalIsOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setMissionData({
      ...missionData,
      [name]: name === 'reward' || name === 'tg_channel_id' ? (value ? parseInt(value) : 0) : value,
    })
  }

  const validate = () => {
    let valid = true
    let newErrors = { name: '', type: '', reward: '', link: '', icon_type: '', tg_channel_id: '' }

    if (!missionData.name) {
      newErrors.name = 'Name is required'
      valid = false
    }
    if (!missionData.type) {
      newErrors.type = 'Type is required'
      valid = false
    }
    if (missionData.type === 'Telegram' && !missionData.tg_channel_id) {
      newErrors.tg_channel_id = 'Channel ID is required for Telegram missions'
      valid = false
    }
    if (!missionData.reward) {
      newErrors.reward = 'Reward is required'
      valid = false
    }
    if (!missionData.link) {
      newErrors.link = 'Link is required'
      valid = false
    }
    if (!missionData.icon_type) {
      newErrors.icon_type = 'Icon type is required'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const createMission = async (): Promise<void> => {
    const res = await api({
      url: '/mission/add-mission',
      data: missionData,
      method: 'POST'
    })
    getMissions()
  }

  const handleSubmit = async () => {
    if (validate()) {
      onClose()
      await createMission()
    }
  }

  const {t} = useTranslation()

  return (
    <>
      <div className="flex justify-between mt-2 items-center text-sm px-2 border-opacity-0 text-white bg-myColors-350 rounded-xl h-[55px]" onClick={() => setModalIsOpen(true)}>
        <div className="flex gap-5 items-center ml-2">
          <div className="flex-col">
            <p className="text-[12px]"></p>
            <div className="flex items-center">
              <p className="text-[14px] font-medium">{t("adminCreateMission")}</p>
            </div>
          </div>
        </div>
        <div>
          <Arrow className="w-[25px] h-[25px]"  />
        </div>
      </div>

      {modalIsOpen && (
        <>
          <div className="fixed inset-0 bg-myColors-400 flex justify-center items-center z-50">
            <div className="bg-myColors-400 rounded-lg w-full max-w-lg h-[100vh] overflow-y-auto">
              <div className="flex justify-end px-5 mt-1">
                <Close className="w-[30px] cursor-pointer" onClick={onClose} />
              </div>

              <div className="p-5">
                <p className="text-xl font-medium mb-4 text-center">{t("adminCreateMission")}:</p>

                <div className="mt-5">
                  <p>{t('adminNameMission')}</p>
                  <input
                    type="text"
                    name="name"
                    className="w-full h-[40px] rounded-lg outline-none text-black px-2"
                    value={missionData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="text-myColors-250 text-sm">{errors.name}</p>}
                </div>

                <div className="mt-5">
                  <label htmlFor="type" className="font-medium text-white">
                    {t("adminTypeMission")}
                  </label>
                  <select
                    name="type"
                    id="type"
                    className="w-full h-[40px] rounded-lg px-1 text-black font-medium outline-none"
                    value={missionData.type}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      {t("adminSelectType")}
                    </option>
                    <option value="Youtube">Youtube</option>
                    <option value="Discord">Discord</option>
                    <option value="Telegram">Telegram</option>
                    <option value="X">X (Twitter)</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                  {errors.type && <p className="text-myColors-250 text-sm">{errors.type}</p>}
                </div>

                {missionData.type === 'Telegram' && (
                  <div className="mt-5">
                    <p>{t("adminChannelId")}</p>
                    <input
                      type="number"
                      name="tg_channel_id"
                      className="w-full h-[40px] rounded-lg outline-none text-black px-2"
                      value={missionData.tg_channel_id || ''}
                      onChange={handleChange}
                    />
                    {errors.tg_channel_id && <p className="text-myColors-250 text-sm">{errors.tg_channel_id}</p>}
                  </div>
                )}

                <div className="mt-5">
                  <p>{t('adminReward')}</p>
                  <input
                    type="number"
                    name="reward"
                    className="w-full h-[40px] rounded-lg outline-none text-black px-2"
                    value={missionData.reward || ''}
                    onChange={handleChange}
                  />
                  {errors.reward && <p className="text-myColors-250 text-sm">{errors.reward}</p>}
                </div>

                <div className="mt-5">
                  <p>{t("adminLink")}</p>
                  <input
                    type="text"
                    name="link"
                    className="w-full h-[40px] rounded-lg outline-none text-black px-2"
                    value={missionData.link}
                    onChange={handleChange}
                  />
                  {errors.link && <p className="text-myColors-250 text-sm">{errors.link}</p>}
                </div>

                <div className="mt-5">
                  <label htmlFor="icon_type" className="font-medium text-white">
                    {t("adminIconMission")}
                  </label>
                  <select
                    name="icon_type"
                    id="icon_type"
                    className="w-full h-[40px] rounded-lg px-1 text-black font-medium outline-none"
                    value={missionData.icon_type}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      {t('adminSelectIcon')}
                    </option>
                    <option value="Youtube">Youtube</option>
                    <option value="Discord">Discord</option>
                    <option value="Telegram">Telegram</option>
                    <option value="X">X (Twitter)</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                  {errors.icon_type && <p className="text-myColors-250 text-sm">{errors.icon_type}</p>}
                </div>

                <div className="mt-5 flex justify-center">
                  <button
                    className='bg-myColors-200 text-myColors-250 h-[45px] w-[100px] flex items-center justify-center font-bold rounded-lg cursor-pointer'
                    onClick={handleSubmit}
                  >
                    {t("adminCreate")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default AddMissions
