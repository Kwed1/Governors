import usePackageStore from '../../../components/store/packagesState'
import useApi from '../../../requestProvider/apiHandler'
import { GetPremiumPackagesInt } from '../types/PremiumPackagesInt'


export default function PremiumPackagesApi() {
	const api = useApi()
	const {updatePackages} = usePackageStore()
	const getPremiumPackages = async() => {
		const res = await api<GetPremiumPackagesInt[]>({
			url: `/identity/get-prices`,
			method: 'GET'
		})
		if (res) updatePackages(res)
	}

	const setRole = async(status: string) => {
		const res = await api({
			url: `/identity/upgrade-status?user_status=${status}`,
			method: 'POST'
		})
		return res
	}
	return {getPremiumPackages,setRole}
}