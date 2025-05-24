import { useMutation, useQuery } from "@tanstack/react-query";
import { NoticeService, TNotice } from "../services/NoticeService";



export class NoticeAdapter {

    static usePostNoticeMutation(body : TNotice, accessToken ?: string) {
        return useMutation({
            mutationFn: () => (NoticeService.PostNotice({
                description : (body.description as string),
                author_id : (body.authorId as string)
            }, accessToken)),   
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
