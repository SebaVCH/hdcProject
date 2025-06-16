import { TNotice, TNoticeResponse } from "../api/services/NoticeService"
import { TRoute } from "../api/services/RouteService"

export default function compareSort(a : TRoute, b : TRoute) {
    if(!a.completedAt || !b.completedAt) {
        return 0
    }
    if(a.completedAt == b.completedAt) {
        return 0
    } else if(a.completedAt > b.completedAt) {
        return -1
    } else {
        return 1
    }
}



export function compareSortNotices(a : TNoticeResponse, b : TNoticeResponse) {
    if(!a.createdAt || !b.createdAt) {
        return 0
    }
    if(a.createdAt == b.createdAt) {
        return 0
    } else if(a.createdAt > b.createdAt) {
        return -1
    } else {
        return 1
    }
}