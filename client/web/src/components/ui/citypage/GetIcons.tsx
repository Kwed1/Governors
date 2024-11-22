import {
	memo
} from 'react'
import Garden from '../../images/mycity/cityIcons/1. Garden.png'
import Library from '../../images/mycity/cityIcons/10. Library.png'
import Museum from '../../images/mycity/cityIcons/11. Museum.png'
import Opera from '../../images/mycity/cityIcons/12. Opera.png'
import BusStation from '../../images/mycity/cityIcons/13. Bus station.png'
import Metro from '../../images/mycity/cityIcons/14. Metro.png'
import Airport from '../../images/mycity/cityIcons/15. Airport.png'
import FirewatchTower from '../../images/mycity/cityIcons/16. Firewatch tower.png'
import FireHouse from '../../images/mycity/cityIcons/17. Fire house.png'
import FireStation from '../../images/mycity/cityIcons/18. Fire station.png'
import Ambulance from '../../images/mycity/cityIcons/19. Ambulance.png'
import Park from '../../images/mycity/cityIcons/2. Park.png'
import MedicalClinic from '../../images/mycity/cityIcons/20. Medical clinic.png'
import Hospital from '../../images/mycity/cityIcons/21. Hospital.png'
import PoliceStation from '../../images/mycity/cityIcons/22. Police station.png'
import PoliceDepartment from '../../images/mycity/cityIcons/23. Police department.png'
import Gis from '../../images/mycity/cityIcons/24. GIS.png'
import School from '../../images/mycity/cityIcons/25. School.jpg'
import College from '../../images/mycity/cityIcons/26. College.png'
import University from '../../images/mycity/cityIcons/27. University.png'
import RadioStation from '../../images/mycity/cityIcons/28. Radio station.png'
import Newspaper from '../../images/mycity/cityIcons/29. Newspaper.png'
import ThemePark from '../../images/mycity/cityIcons/3. Theme park.png'
import TVStation from '../../images/mycity/cityIcons/30. TV station.png'
import CurrencyExchange from '../../images/mycity/cityIcons/31. Currency exchange.png'
import Bank from '../../images/mycity/cityIcons/32. Bank.png'
import StockExchange from '../../images/mycity/cityIcons/33. Stock exchange.png'
import TennisCourt from '../../images/mycity/cityIcons/34. Tennis court.png'
import BasketballArena from '../../images/mycity/cityIcons/35. Basketball arena.png'
import Stadium from '../../images/mycity/cityIcons/36. Stadium.png'
import OilPowerPlant from '../../images/mycity/cityIcons/37. Oil power plant.png'
import SolarPowerPlant from '../../images/mycity/cityIcons/38. Solar power plant.png'
import NuclearPowerPlant from '../../images/mycity/cityIcons/39. Nuclear power plant.png'
import YogaGarden from '../../images/mycity/cityIcons/4. Yoga park.png'
import Hostel from '../../images/mycity/cityIcons/40. Hostel.png'
import PlazaHotel from '../../images/mycity/cityIcons/41. Plaza hotel.png'
import GrandResort from '../../images/mycity/cityIcons/42. Grand resort.png'
import LocalBingoClub from '../../images/mycity/cityIcons/43. Bingo club.png'
import PokerClub from '../../images/mycity/cityIcons/44. Poker club.png'
import Casino from '../../images/mycity/cityIcons/45. Casino.png'
import Sauna from '../../images/mycity/cityIcons/5. Sauna.png'
import CommunityPool from '../../images/mycity/cityIcons/6. Community pool.png'
import GeneralStore from '../../images/mycity/cityIcons/7. General store.png'
import ShoppingCenter from '../../images/mycity/cityIcons/8. Shopping center.png'
import Mall from '../../images/mycity/cityIcons/9. City mall.png'

export const GetIcon = memo(({ iconType }: { iconType: string }) => {
	switch (iconType) {
			case 'Hospital':
					return <img src={Hospital} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Garden':
					return <img src={Garden} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'GIS (Governors Intelligence Service)':
				return <img src={Gis} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Police Department':
				return <img src={PoliceDepartment} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Police Station':
				return <img src={PoliceStation} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Medical Clinic':
				return <img src={MedicalClinic} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Park':
					return <img src={Park} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Theme Park':
					return <img src={ThemePark} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Yoga Garden':
					return <img src={YogaGarden} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Sauna':
					return <img src={Sauna} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Community Pool':
					return <img src={CommunityPool} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'General Store':
					return <img src={GeneralStore} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Shopping Center':
					return <img src={ShoppingCenter} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Mall':
					return <img src={Mall} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Library':
					return <img src={Library} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Museum':
					return <img src={Museum} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Opera':
					return <img src={Opera} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Bus Station':
					return <img src={BusStation} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Metro':
					return <img src={Metro} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Airport':
					return <img src={Airport} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Firewatch Tower':
					return <img src={FirewatchTower} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Fire House':
					return <img src={FireHouse} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Fire Station':
					return <img src={FireStation} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Ambulance':
					return <img src={Ambulance} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'School':
					return <img src={School} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'College':
					return <img src={College} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'University':
					return <img src={University} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Radio Station':
					return <img src={RadioStation} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Newspaper':
					return <img src={Newspaper} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'TV Station':
					return <img src={TVStation} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Currency Exchange':
					return <img src={CurrencyExchange} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Bank':
					return <img src={Bank} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Stock Exchange':
					return <img src={StockExchange} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Tennis Court':
					return <img src={TennisCourt} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Basketball Arena':
					return <img src={BasketballArena} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Stadium':
					return <img src={Stadium} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Oil Power Plant':
					return <img src={OilPowerPlant} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Solar Power Plant':
					return <img src={SolarPowerPlant} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Nuclear Power Plant':
					return <img src={NuclearPowerPlant} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Hostel':
					return <img src={Hostel} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Plaza Hotel':
					return <img src={PlazaHotel} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Grand Resort':
					return <img src={GrandResort} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Local Bingo Club':
					return <img src={LocalBingoClub} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Poker Club':
					return <img src={PokerClub} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			case 'Casino':
					return <img src={Casino} alt='' className='w-[70px] h-[70px] rounded-lg' />;
			default:
					return null;
	}
});
