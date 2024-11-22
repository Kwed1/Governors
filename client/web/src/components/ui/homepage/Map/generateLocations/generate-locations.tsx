import { LocationInfo } from '../../type'

interface Props {
	getPointsReq: () => Promise<void>,
	position: [number, number] | null,
	locationInfo: LocationInfo
}

export default function GenerateLocaitons({getPointsReq, position, locationInfo}:Props) {
	return (
		<button className={`w-[85px] h-[85px] p-2 bg-opacity-35 inset-0 rounded-full flex items-center justify-center bg-red-600 ${locationInfo?.generate_chance <= 0 && 'opacity-55'}`}
		onClick={() => position && locationInfo?.generate_chance > 0 && getPointsReq()}
		>
             <div className='inset-0 w-full h-full bg-opacity-35 p-1 flex-col bg-red-500 rounded-full flex items-center justify-center'
						 style={{background: '#FF0000E5'}}>
                <p className='text-white text-[10px]'>
									Generate Locations {locationInfo?.generate_chance}/{locationInfo?.generate_max_chanced}
								</p>
             </div>
    </button>
	)
}