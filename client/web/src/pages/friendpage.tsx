import { initUtils } from '@tma.js/sdk'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as Copy } from '../components/images/friendpage/copy.svg'
import FriendDescr from '../components/ui/friendspage/frienddescr'
import FriendTable from '../components/ui/friendspage/friendtable'
import SuccessSnackbar from '../hooks/successSnackbar'
import { useTelegram } from '../hooks/useTelegram'
const Friendpage = () => {
	const { userId } = useTelegram()
	const [link, setLink] = useState<string>(`https://t.me/govuatbot?start=${userId}`)
	const [copySuccess, setCopySuccess] = useState<string>('')
	const { t } = useTranslation()

	
	const handleShareClick = () => {
			const utils = initUtils()
			if (userId) {
				const shareUrll = `https://t.me/govuatbot?start=${userId}`
				utils.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(shareUrll)}`)
			} else {
				console.error('User ID is not available.')
			}
	}

	const copyToClipboard = () => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(link).then(() => {
				setCopySuccess(t('linkCopied'))
				setTimeout(() => {
					setCopySuccess('')
				}, 2000)
			}).catch((error) => {

			})
		} else {
			const textarea = document.createElement('textarea')
			textarea.value = link
			document.body.appendChild(textarea)
			textarea.select()
			try {
				document.execCommand('copy')
				setCopySuccess(t('linkCopied'))
				setTimeout(() => {
					setCopySuccess('')
				}, 2000)
			} catch (error) {

			}
			document.body.removeChild(textarea)
		}
		setTimeout(() => setCopySuccess(''), 2000)
	}


	return (
		<>
			<div className={`fixed w-full h-[80vh] bg-myColors-100 rounded-t-[30px] bottom-0 `}>
				<div className='h-[50px] items-center flex justify-center text-white text-2xl font-bold bg-myColors-100 rounded-t-[30px] gap-2'>
					<p className='mb-1'>{t("friends")}</p>
				</div>

				<div className='h-full p-5 text-white bg-myColors-450 overflow-y-scroll pb-[100px]'>
					<div>
						<FriendDescr />
					</div>
					<div className='mt-5'>
						<FriendTable />
					</div>

					<div className='w-full'>
						<div className='flex justify-between items-center text-white mt-4'>

							<button className='bg-myColors-500 rounded-xl py-3 p-2 w-[280px] font-bold' onClick={() => handleShareClick()}>
								{t('inviteAFriend')}
							</button>

							<button className='bg-myColors-500 p-2 px-3 py-3 rounded-xl' onClick={() => copyToClipboard()}>
								<Copy />
							</button>

						</div>
					</div>

				</div>
			</div>

			<SuccessSnackbar message={copySuccess} />
		</>
	)
}

export default Friendpage