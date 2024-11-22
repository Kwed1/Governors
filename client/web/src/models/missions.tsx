
export interface missions {
    id: string,
    name: string,
    reward: number,
    link: string,
    icon_type: string,
    status: string,
    tg_id: number
}

export interface addMission {
    name: string,
    type: string,
    reward: number,
    link: string,
    icon_type: string,
    tg_channel_id: number
}
