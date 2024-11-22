import useLevelsStore from '../../../components/store/levelState'
import useApi from '../../../requestProvider/apiHandler'
import { GetLevelsType } from '../type'


export default function useLevelApi() {
	const api = useApi()
	const {setLevels} = useLevelsStore()
	const getLevels = async() => {
		const res = await api<GetLevelsType[]>({
			url: `/identity/lvl-data`,
			method: 'GET'
		})
		if (res) setLevels(res)
	}
	return {getLevels}
}
