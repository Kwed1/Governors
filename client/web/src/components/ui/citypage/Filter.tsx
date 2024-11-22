interface Props {
	filter: string;
	setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export default function CityBuildingFilter({ setFilter, filter }: Props) {
	const Filtration = (name: string) => {
		setFilter(name);
	};

	return (
		<div className="w-full flex justify-center px-2 py-3">
			<div className="p-[1px] w-full flex justify-between items-center bg-myColors2-100 rounded-[8px]">
				<button
					className={`relative w-full py-2 text-[12px] font-medium ${
						filter === 'East' ? 'bg-myColors-150 text-white' : 'bg-transparent text-gray-300'
					} rounded-[8px]`}
					onClick={() => Filtration('East')}
				>
					Eastern District
					{filter !== 'East' && (
						<div className="absolute right-0 top-2 h-[20px] w-[1px] bg-myColors2-150 z-0"></div>
					)}
				</button>
				<button
					className={`relative w-full py-2 text-[12px] font-medium ${
						filter === 'West' ? 'bg-myColors-150 text-white' : 'bg-transparent text-gray-300'
					} rounded-[8px]`}
					onClick={() => Filtration('West')}
				>
					Western District
					{filter !== 'West' && (
						<div className="absolute right-0 top-2 h-[20px] w-[1px] bg-myColors2-150 z-0"></div>
					)}
				</button>
				<button
					className={`relative w-full py-2 text-[12px] font-medium ${
						filter === 'Downtown' ? 'bg-myColors-150 text-white' : 'bg-transparent text-gray-300'
					} rounded-[8px] flex items-center justify-center`}
					onClick={() => Filtration('Downtown')}
				>
					DownTown
					<span className="ml-1 text-yellow-400">👑</span>
				</button>
			</div>
		</div>
	);
}
