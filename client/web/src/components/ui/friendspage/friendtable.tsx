import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNecessary } from '../../../hooks/necessary'
import { friends, friendsData } from '../../../models/friends'
import useApi from '../../../requestProvider/apiHandler'
import { ReactComponent as Coin } from '../../images/homepage/coin.svg'
import useStore from '../../store/zustand'


const FriendTable = () => {
	const { t } = useTranslation()
	const api = useApi()
	const { getAccessToken } = useStore()
	const [friends, setFriends] = useState<friendsData[]>([])
	const [referal, setReferal] = useState<string>('')
	const [total, setTotal] = useState<number>(0)
	const [hasMore, setHasMore] = useState<boolean>(true)
	const [skip, setSkip] = useState<number>(0)
	const once = useRef<boolean>(false)
	const take = 5
	const token = getAccessToken()
	const {getMissions} = useNecessary()

	const getFriends = async (): Promise<void> => {
		if (!token) return

		try {
			const res = await api<friends>({
				url: `/friend/get-friends?skip=${skip}&take=${take}`,
				method: 'GET'
			})

			if (res) {
				setFriends(prevFriends => [...prevFriends, ...res.data])
				setReferal(res.user_inviter)
				setTotal(res.total)
				if (res.data.length < take || friends.length + res.data.length >= res.total) {
					setHasMore(false)
				}
			}
		} catch (error) {
			setHasMore(false)
		}
	}

	const fetchMoreData = () => {
		setSkip(prevSkip => prevSkip + take)
	}

	useEffect(() => {
		if (token && !once.current) {
			getFriends()
			once.current = true
		}
	}, [token])

	useEffect(() => {
		if (skip > 0) {
			getFriends()
		}
	}, [skip])

	return (
		<>
			{referal && (
				<div className='flex justify-between'>
					<p>{t('yourInviter')}</p>
					<p>@{referal}</p>
				</div>
			)}
			<p className='text-center text-xl font-medium mt-5'>{t("myFriends")}</p>

			<div id="scrollableDiv" className='h-[21vh] h-xs:h-[11vh] h-md:h-[17vh]' style={{ overflow: 'auto', color: 'white' }}>
				<InfiniteScroll
					dataLength={friends?.length}
					next={fetchMoreData}
					hasMore={hasMore}
					loader={<h4 className='text-center mt-4'>{t('loading')}</h4>}
					scrollableTarget="scrollableDiv"
				>
					{friends.map((friend, index) => (
						<div key={index} className='flex justify-between items-center border-b pb-1 mt-6'>
							<div>
								<p className='font-medium'>{friend.user_name}</p>
							</div>
							<div className='flex items-center'>
								<Coin className='w-[23px] h-[23px]' />
								<p className='text-sm'>+{friend.bonus}</p>
							</div>
						</div>
					))}
					{friends?.length === 0 ? (
								<p style={{ textAlign: 'center' }} className='mt-4'>
										{t('noFriends')}
								</p>
						) : null}
				</InfiniteScroll>
			</div>
		</>
	)
}

export default FriendTable
