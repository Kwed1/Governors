import MuiAlert, { AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import React from 'react'
import { ReactComponent as Delete } from '../components/images/delete.svg'
import { ReactComponent as Logo } from '../components/images/logo.svg'
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface ErrorSnackbarProps {
    error: string;
    onClose: () => void;
}

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({ error, onClose }) => {

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        onClose();
    };
    

    return (
      <Snackbar
      open={error !== ''}
      onClose={handleClose}
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

          <div className='w-[300px] bg-myColors-850 border-red-800 border h-[40px] px-5 flex items-center rounded-xl text-[12px] gap-2 font-medium'>
            <Delete className='w-[20px]'/>
            <p className='mt-[2px]'>
             {error}
            </p>
          </div>
        </div>
      </Alert>
    </Snackbar>
    );
};

export default ErrorSnackbar;
