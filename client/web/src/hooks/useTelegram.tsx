interface TelegramUser {
    id: number
    username: string
    first_name: string
}

interface TelegramData {
    user: TelegramUser | null
}

interface TelegramWebApp {
    initDataUnsafe?: TelegramData
    close: () => void
    sendData: (s: string) => void
    onEvent: (s: string, f: any) => void
    offEvent: (s: string, f: any) => void
    platform: string
}

const tg: TelegramWebApp = (window as any).Telegram.WebApp

export function useTelegram() {

    const onClose = () => {
        tg.close()
    }

    const userId = tg.initDataUnsafe?.user?.id || 6485315240
    const user = tg.initDataUnsafe?.user?.username || 'kwed1'
    const name = tg.initDataUnsafe?.user?.first_name || null

    return {
        onClose,
        tg,
        userId,
        user,
        name,
    }

}
