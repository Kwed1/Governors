import { createTheme, ThemeProvider } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNecessary } from '../../../hooks/necessary'
import useApi from '../../../requestProvider/apiHandler'
import { ReactComponent as Close } from '../../images/airdrop/close.svg'
import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

interface Reward {
  from_place: number;
  to_place: number;
  reward: number;
}

interface GameDetails {
  start_at: string;
  place: number;
  rewards: Reward[];
}

const AddOnlineGame = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [gameDetails, setGameDetails] = useState<GameDetails>({
    start_at: '',
    place: 0,
    rewards: [],
  });
  const [from, setFrom] = useState<number | string>('');
  const [to, setTo] = useState<number | string>('');
  const [reward, setReward] = useState<number | string>('');
  const [date, setDate] = useState<Dayjs | null>(null);
  const [time, setTime] = useState<string>('');
  const [error, setError] = useState<string>('');
  const api = useApi();
  const {t} = useTranslation()
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9:]/g, '');
    setTime(value);
    updateStartAt(date, value);
  };

  const handleInputPrize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setReward(value);
  };

  const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setGameDetails({
      ...gameDetails,
      place: Number(value),
    });
  };

  const handleAddReward = () => {
    if (from !== '' && to !== '' && reward !== '') {
      setGameDetails({
        ...gameDetails,
        rewards: [
          ...gameDetails.rewards,
          { from_place: Number(from), to_place: Number(to), reward: Number(reward) },
        ],
      });
      setFrom('');
      setTo('');
      setReward('');
      setError('');
    } else {
      setError('Please fill in all reward fields.');
    }
  };

  const handleDeleteReward = (index: number) => {
    setGameDetails({
      ...gameDetails,
      rewards: gameDetails.rewards.filter((_, i) => i !== index),
    });
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    setDate(newDate);
    updateStartAt(newDate, time);
  };

  const updateStartAt = (date: Dayjs | null, time: string) => {
    if (date && time && /^(\d{2}):(\d{2})$/.test(time)) {
      const dateTimeString = `${date.format('YYYY-MM-DD')}T${time}:00`;
      setGameDetails({
        ...gameDetails,
        start_at: dateTimeString,
      });
      setError('');
    } else {
      setError('Invalid date or time format');
    }
  };

  const validateInputs = (): boolean => {
    if (!date || !time || !gameDetails.place || gameDetails.rewards.length === 0) {
      setError('Please fill in all fields correctly.');
      return false;
    }
    if (!/^(\d{2}):(\d{2})$/.test(time)) {
      setError('Invalid time format.');
      return false;
    }
    if (gameDetails.rewards.some(reward => reward.from_place > gameDetails.place || reward.to_place > gameDetails.place)) {
      setError('Reward places cannot exceed the number of participants.');
      return false;
    }
    return true;
  };

  const theme = createTheme({
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
          },
          input: {
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
          },
        },
      },
    },
  });

  const handleClose = () => {
    setGameDetails({
      start_at: '',
      place: 0,
      rewards: [],
    });
    setFrom('');
    setTo('');
    setReward('');
    setDate(null);
    setTime('');
    setError('');
    setOpenModal(false);
  };

  const {getGames} = useNecessary()

  const addGame = async () => {
    if (validateInputs()) {
      try {
        handleClose(); 
        const res = await api({
          method: 'POST',
          url: '/game/online',
          data: gameDetails,
        });
        getGames()
      } catch (err) {
        setError('Failed to add game.');
      }
    }
  };

  return (
    <>
      <div className={`flex justify-between mt-2 items-center text-sm px-2 border-opacity-0 text-white bg-myColors-350 rounded-xl h-[55px]`}  onClick={() => setOpenModal(true)}>
        <div className='flex gap-5 items-center ml-2'>
          <div className='flex-col'>
            <p className='text-[12px]'></p>
            <div className='flex items-center'>
              <p className='text-[14px] font-medium'>{t('adminOnline')}</p>
            </div>
          </div>
        </div>
        <div>
          <Arrow className='w-[25px] h-[25px]' />
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-myColors-400 flex justify-center items-center z-50">
          <div className="bg-myColors-400 rounded-lg w-full max-w-lg h-[100vh] overflow-y-auto">
            <div className='flex justify-end px-5 mt-1'>
              <Close className='w-[30px] cursor-pointer' onClick={handleClose} />
            </div>

            <div className="p-5">
              <p className='text-xl font-medium mb-4 text-center'>{t('adminCreateGameOnline')}</p>

              <div className="mb-5">
                <p className='text-white'>{t("adminStartDate")}</p>
                <div className='max-h-[40px] h-full'>
                <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <DatePicker
                    value={date}
                    onChange={handleDateChange}
                    className='w-full bg-white rounded-lg outline-none'
                    slotProps={{
                      textField: {
                        InputProps: {
                          sx: {
                            height: 40,
                            padding: 0,
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'transparent',
                              },
                              '&:hover fieldset': {
                                borderColor: 'transparent', 
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'transparent', 
                              },
                            },
                          },
                        },
                        InputLabelProps: {
                          sx: {
                            height: 40, 
                          },
                        },
                        sx: {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent', 
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent', 
                          },
                          '& .MuiInputBase-input': {
                            outline: 'none', 
                            boxShadow: 'none', 
                          },
                          '& .MuiInputBase-root': {
                            outline: 'none', 
                            boxShadow: 'none', 
                          },
                          '& .Mui-focused .MuiInputBase-root': {
                            outline: 'none', 
                            boxShadow: 'none', 
                          },
                          '&:focus-within .MuiInputBase-root': {
                            outline: 'none', 
                            boxShadow: 'none',
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
                </ThemeProvider>
                </div>
              </div>

              <div className="mb-5">
                <p className='text-white'>{t("adminStartTime")}</p>
                <input
                  type="text"
                  placeholder="HH:MM"
                  value={time}
                  onChange={handleInput}
                  className='text-black w-full mt-1 rounded-lg h-[40px] px-2 outline-none'
                />
              </div>

              <div className="mb-5">
                <p className='text-white'>{t("adminParticipants")}</p>
                <input
                  type="text"
                  value={gameDetails.place}
                  onChange={handlePlaceChange}
                  className='text-black w-full mt-1 rounded-lg h-[40px] px-2 outline-none'
                />
              </div>

              <div className='mb-5'>
                <p className='text-center text-white font-bold mb-4'>{t("adminRewards")}</p>

                <div className='flex flex-col gap-4'>
                  <div className='flex justify-between pb-1 border-b'>
                    <p className='text-sm'>{t('adminParticipantsFrom')}</p>
                    <input
                      type="number"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className='w-[50px] bg-transparent outline-none text-center'
                    />
                  </div>

                  <div className='flex justify-between pb-1 border-b'>
                    <p className='text-sm'>{t("adminParticipantsTo")}</p>
                    <input
                      type="number"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className='w-[50px] bg-transparent outline-none text-center'
                    />
                  </div>

                  <div className='flex justify-between pb-1 border-b'>
                    <p className='text-sm'>{t("adminReward")}</p>
                    <input
                      type="number"
                      value={reward}
                      onChange={handleInputPrize}
                      className='w-[50px] bg-transparent outline-none text-center'
                    />
                  </div>

                  <div
                    onClick={handleAddReward}
                    className='bg-myColors-200 h-[45px] flex items-center justify-center font-bold rounded-lg cursor-pointer'
                  >
                    <p className='text-lg'>{t("adminAdd")}</p>
                  </div>

                  {error && (
                    <p className='text-red-500 text-center mt-2'>{error}</p>
                  )}

                  {gameDetails.rewards.map((reward, index) => (
                    <div
                      key={index}
                      className='flex justify-between h-[40px] bg-myColors-650 text-black items-center text-sm rounded-lg px-3'
                    >
                      <p>{`${reward.from_place}-${reward.to_place} / ${reward.reward}`}</p>
                      <Delete
                        onClick={() => handleDeleteReward(index)}
                        className='w-[20px] h-[20px] cursor-pointer'
                      />
                    </div>
                  ))}

                  <div
                    onClick={addGame}
                    className='bg-myColors-200 text-myColors-250 h-[45px] flex items-center justify-center font-bold rounded-lg cursor-pointer'
                  >
                    <p>{t("adminSchelude")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddOnlineGame;
