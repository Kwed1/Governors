import { create } from 'zustand'
import { GetPremiumPackagesInt } from '../../pages/premiumpage/types/PremiumPackagesInt'
interface PackagesStore {
	packages: GetPremiumPackagesInt[]
	updatePackages: (packages: GetPremiumPackagesInt[]) => void
}
const usePackageStore = create<PackagesStore>((set, get) => ({
	packages: [],
	updatePackages(packages) {
		set({packages})
	},
}));

export default usePackageStore;
