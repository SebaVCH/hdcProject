import { useMutation, useQuery } from "@tanstack/react-query";
import { NoticeService, TNotice, TNoticeResponse } from "../services/NoticeService";

export type NoticesReadUnread = {
    read : TNoticeResponse[]
    unread : TNoticeResponse[]
}

export class NoticeAdapter {


    static useMarkNoticesMutation( accessToken : string ) {
        return useMutation({
            mutationFn : (unreadNotices : TNoticeResponse[]) => (NoticeService.MarkAsReadNotices(unreadNotices, accessToken))
        })
    }

    static usePostNoticeMutation(body : TNotice, accessToken ?: string) {
        return useMutation({
            mutationFn: () => (NoticeService.PostNotice({
                description : (body.description as string),
                author_id : (body.authorId as string)
            }, accessToken)),   
        })
    }

    static useGetNoticesMap(accessToken ?: string ) {
        return useQuery({
            queryKey : ['notices-read/unread'],
            queryFn: async () => ({
                read : await NoticeService.GetReadNotices(accessToken),
                unread : await NoticeService.GetUnReadNotices(accessToken)
            })
        })
    }

    static useGetNotices(accessToken ?: string) {
        return useQuery({
            queryKey: ['notices'],
            queryFn: () => (NoticeService.GetNotices(accessToken))
             
        })
    }

    static useDeleteNoticeMutation(_id : string, accessToken ?: string) {
        return useMutation({
            mutationFn: () => (NoticeService.DeleteNotice(_id, accessToken))
        })
    }

    static useUpdateNoticeMutation(body : TNotice, accessToken ?: string) {
        return useMutation({
            mutationFn: () => (NoticeService.UpdateNotice(body, accessToken)),
        })
    }
}
