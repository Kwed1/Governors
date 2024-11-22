import QRCode from 'qrcode.react'
import '../components/ui/background.css'

const Desktop = () => {
	const url = 'https://t.me/Governorsgame_bot'
return (
	<>
	<div className='w-full h-[100vh] flex justify-center items-center'>
		<div className='max-w-[350px] w-full flex flex-col items-center justify-center'>
			<p className='text-center text-white font-bold text-2xl'>Access the app <br/> through your phone</p>
			
			<div className='p-3 bg-white rounded-2xl mt-5'>
			   <QRCode value={url} size={150} bgColor="#ffffff" />
			</div>

			<p className='text-center text-white font-bold text-2xl mt-5'>@governorsgame_bot</p>
		</div>
	</div>
	</>
)
}

export default Desktop