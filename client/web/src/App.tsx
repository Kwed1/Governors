import { init, on } from '@telegram-apps/sdk'
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react'
import { useEffect, useState } from 'react'
import { ErrorProvider, useError } from "./requestProvider/errorContext"
import ErrorSnackbar from './requestProvider/errorSnackbar'
import Router from './router/router'
function App() {
  init()
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const haveHeader = true;
  const activeTab = null;

  useEffect(() => {
    const removeListener = on('viewport_changed', (payload) => {
      setViewportHeight(payload.height);
      setViewportWidth(payload.width);
    });

    return () => {
      removeListener();
    };
  }, []);

  interface TelegramWebApp {
    requestFullscreen: () => void
    close: () => void;
    expand: () => void
  }
  
  const tg: TelegramWebApp = (window as any).Telegram.WebApp;
  useEffect(() => {
      if (tg && tg.requestFullscreen) {
          tg.requestFullscreen();
      }
  }, []);

  return (
    <TonConnectUIProvider
    manifestUrl="https://tgmochispa.devmainops.store/tonconnect-manifest.json"
    uiPreferences={{theme: THEME.DARK}}
    actionsConfiguration={{
      twaReturnUrl: 'https://t.me/govuatbot'
    }}>
      <ErrorProvider>
        <div 
        style={{
          maxHeight: viewportHeight - (haveHeader ? 90 : 72),
          minHeight: viewportHeight - (haveHeader ? 90 : 72),
          height: `calc(100% - ${haveHeader ? 90 : 72}px)`,
          WebkitOverflowScrolling: 'touch',
          overflow:
            activeTab === 'TAP' || activeTab === 'PROFILE'
              ? 'hidden'
              : 'auto',
        }}>
          <AppContext/>
        </div>
      </ErrorProvider>
    </TonConnectUIProvider> 
  );
}

const AppContext = () => {
  const { error, setError } = useError();
  return (
    <>
     <Router/>
     <ErrorSnackbar error={error} onClose={() => setError('')} />
    </>
  )
}

export default App;
