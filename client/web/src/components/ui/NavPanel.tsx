import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import useStore from '../store/zustand'

const NavPanel = () => {
	const [activeLink, setActiveLink] = useState<string | null | boolean>(null)
	const location = useLocation()

	useEffect(() => {
		setActiveLink(location.pathname)
	}, [location.pathname])

	const { role } = useStore()
	const { t } = useTranslation()


	return (
		<>
			<footer className="fixed bottom-3 left-0 w-full text-white px-2 z-10  font-Monsterrat">

				<div className='w-full h-[65px] flex items-center rounded-xl bg-myColors-100 gap-2 '>

					<Link to={'/'} className='flex flex-col items-center h-full w-[90px] justify-center rounded-xl' style={{ backgroundColor: activeLink === '/' ? '#191919' : '' }}>
						<p className='text-[11px] text-center tracking-wider' style={{ color: activeLink === '/' ? '#FFCC00' : 'white' }}>{t('navpanelEarn')}</p>
					</Link>

					{/* <Link to={'/wallet'} className='flex flex-col items-center'>
						<Wallet style={{ fill: activeLink === '/wallet' ? 'white' : '#616161' }} className='pb-1' />
						<p className='text-[10px] text-center tracking-wider' style={{ color: activeLink === '/wallet' ? 'white' : '#616161' }}>Wallet</p>
					</Link>

					<Link to={'/admin'} className='flex flex-col items-center'>
						<Admin style={{ fill: activeLink === '/admin' ? 'white' : '#616161' }} className='pb-1 w-[30px]' />
						<p className='text-[10px] text-center tracking-wider' style={{ color: activeLink === '/admin' ? 'white' : '#616161' }}>Admin</p>
					</Link> */}

					<Link to={'/mycity'} className='flex flex-col items-center h-full w-[90px] justify-center rounded-xl' style={{ backgroundColor: activeLink === '/mycity' ? '#191919' : '' }}>
						<p className='text-[11px] text-center  tracking-wider' style={{ color: activeLink === '/mycity' ? '#FFCC00' : 'white' }}>{t("navpanelMyCity")}</p>
					</Link>

					<Link to={'/friends'} className='flex flex-col items-center h-full w-[90px] justify-center rounded-xl' style={{ backgroundColor: activeLink === '/friends' ? '#191919' : '' }}>
						<p className='text-[11px] text-center tracking-wider' style={{ color: activeLink === '/friends' ? '#FFCC00' : 'white' }}>{t("navpanelFriends")}</p>
					</Link>

					<Link to={'/rewards'} className='flex flex-col items-center h-full w-[90px] justify-center rounded-xl' style={{ backgroundColor: activeLink === '/rewards' ? '#191919' : '' }}>
						<p className='text-[11px] text-center tracking-wider' style={{ color: activeLink === '/rewards' ? '#FFCC00' : 'white' }}>{t("navpanelRewards")}</p>
					</Link>

					<Link to={'/airdrop'} className='flex flex-col items-center h-full w-[90px] justify-center rounded-xl' style={{ backgroundColor: activeLink === '/airdrop' ? '#191919' : '' }}>
						<p className='text-[11px] text-center tracking-wider' style={{ color: activeLink === '/airdrop' ? '#FFCC00' : 'white' }}>{t("navpanelAirdrop")}</p>
					</Link>

					{role === 'admin' && (
						<Link to={'/admin'} className='flex flex-col items-center h-full w-[90px] justify-center rounded-xl' style={{ backgroundColor: activeLink === '/admin' ? '#191919' : '' }}>
							<p className='text-[11px] text-center tracking-wider' style={{ color: activeLink === '/admin' ? '#FFCC00' : 'white' }}>{t("navpanelAdmin")}</p>
						</Link>
					)}



				</div>
			</footer>
		</>
	)
}

export default NavPanel
