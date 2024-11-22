import { Route, Routes } from 'react-router-dom'
import { NavPanelProvider } from '../hooks/necessary'
import Adminpage from '../pages/adminpage'
import Airdroppage from '../pages/airdroppage'
import Citypage from '../pages/citypage'
import Desktop from '../pages/desktop'
import Friendpage from '../pages/friendpage'
import Homepage from '../pages/homepage'
import Levelpage from '../pages/levelpage'
import PremiumPage from '../pages/premiumpage'
import Rewardspage from '../pages/rewardspage'
import Settingspage from '../pages/settingspage'

const Router = () => {
	return (
		<>
		<Routes>
			<Route path='/' element={
				<NavPanelProvider>
				<Homepage/>
				</NavPanelProvider>
				} />
				<Route path='/level' element={
				<NavPanelProvider>
				<Levelpage/>
				</NavPanelProvider>
				} />
			<Route path='/desktop' element={
				<Desktop/>
				} />
			<Route path='/mycity' element={
				<NavPanelProvider>
				<Citypage/>
				</NavPanelProvider>
				} />
			<Route path='/friends' element={
				<NavPanelProvider>
				<Friendpage/>
				</NavPanelProvider>
				} />
			<Route path='/rewards' element={
				<NavPanelProvider>
				<Rewardspage/>
				</NavPanelProvider>
				} />
			<Route path='/airdrop' element={
				<NavPanelProvider>
				<Airdroppage/>
				</NavPanelProvider>
				} />
			<Route path='/Settings' element={
				<NavPanelProvider>
				<Settingspage/>
				</NavPanelProvider>
				} />
			<Route path='/admin' element={
				<NavPanelProvider>
				<Adminpage/>
				</NavPanelProvider>
				} />
			<Route path='/premium' element={
				<NavPanelProvider>
				<PremiumPage/>
				</NavPanelProvider>
				} />
		</Routes>
		</>
	)
}

export default Router