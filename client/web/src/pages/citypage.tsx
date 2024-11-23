import SwipeUpPanel from '../components/ui/citypage/swipeUpPanel'

const Citypage = () => {
	return (
		<>
		<div className='backgroundCity mt-[19vh] custom-sm:mt-[22vh]'/>
			<div className='h-full'>
				<div className='flex w-full justify-center px-5 text-white gap-3'>
					<SwipeUpPanel/>
				</div>
			</div>
		</>
	)
}

export default Citypage