import { GetLevelsType } from '../../pages/levelpage/type'

export interface LevelsStoreInt {
	levels: GetLevelsType[],
	setLevels: (levels: GetLevelsType[]) => void
}

