import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { ReactComponent as Apply } from '../components/images/apply.svg'
import { ReactComponent as Logo } from '../components/images/logo.svg'


interface props {
	message: string
}

const SuccessSnackbar = ({ message }:props) => {
    
    return (
      <Snackbar
      open={message !== ''}
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          width: '100%',
          borderRadius: '35px',
          position: 'absolute',
          top: '2px',
          right: '4px',
        },
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Alert
        icon={false}
        sx={{
          backgroundColor: 'black',
          color: 'white',
          '& .MuiAlert-icon': {
            color: 'white',
          },
        }}
      >
        <div className='flex items-center gap-2'>
          <div>
            <Logo className='w-[40px] h-[40px]'/>
          </div>

          <div className='w-[300px] bg-myColors-850 border-green-700 border h-[40px] px-5 flex items-center rounded-2xl text-[12px] gap-2 font-medium'>
            <Apply className='w-[20px]'/>
            <p className='mt-[2px]'>
             {message}
            </p>
          </div>
        </div>
      </Alert>
    </Snackbar>
    );
};

export default SuccessSnackbar;
