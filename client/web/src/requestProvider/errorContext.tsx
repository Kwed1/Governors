import React, { ReactNode, createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
interface ErrorContextType {
    error: string
    setError: (error: string) => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [error, setError] = useState<string>('')
    const navigate = useNavigate()
    const { userId, tg } = useTelegram()

    /* useEffect(() => {
        if (process.env.NODE_ENV !== "development") {
            if (!userId || tg.platform === 'tdesktop') {
                navigate('/desktop')
            }
        }
    }, []) */



    return (
        <ErrorContext.Provider value={{ error, setError }}>
            {children}
        </ErrorContext.Provider>
    )
}

export const useError = (): ErrorContextType => {
    const context = useContext(ErrorContext)
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider')
    }
    return context
}