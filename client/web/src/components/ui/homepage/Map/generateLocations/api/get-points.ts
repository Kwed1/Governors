import useApi from '../../../../../../requestProvider/apiHandler'
import { getGenerated } from '../../../type'





export default function GetPointsApi() {
	const api = useApi()
	const setPoints = async(latitude:number | null, longitude:number | null) => {
		const res = await api<getGenerated>({
			url: '/game/generate-points',
			method: 'POST',
			data: {
				latitude: latitude,
				longitude: longitude
			}
		})
		return res
	}

	const getPoints = async() => {
		const res = await api<getGenerated>({
			url: '/game/get-points',
			method: 'GET',
		})
		return res
	}
	

	const claimLocation = async(id:string) => {
		const res = await api<getGenerated>({
			url: `/game/claim/${id}`,
			method: 'POST'
		})
		return res
	}
	const claimVirtual = async(id:string) => {
		const res = await api<getGenerated>({
			url: `/game/virtual_claim/${id}`,
			method: 'POST'
		})
		return res
	}
	return {setPoints, claimLocation, getPoints, claimVirtual}
}