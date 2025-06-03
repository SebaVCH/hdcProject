import { useEffect, useState } from "react";
import { Divider, Accordion, AccordionSummary, Typography, AccordionDetails, List, Stack } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Mensaje from "./Mensaje";
import { TNotice } from "../api/services/NoticeService";
import { NoticeAdapter } from "../api/adapters/NoticeAdapter";
import useSessionStore from "../stores/useSessionStore";
import { UserService } from "../api/services/UserService";




export default function MensajesFijados() {

    const [ list, setList ] = useState<TNotice[]>([]);
    const { accessToken } = useSessionStore()
    const { isSuccess, data } = NoticeAdapter.useGetNotices(accessToken)

    useEffect(() => {
        if(data) {
            setList(data)
        }
    }, [data])

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/5 items-start gap-2 rounded bg-white">
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >  
                    <Typography variant="subtitle1">Avisos</Typography>                    
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                    <List className="max-h-[210px] overflow-y-auto">
                        {isSuccess ? list.map((value, index) => (
                            <Mensaje key={index} index={index} list={list} setList={setList} author={value.authorName ?? 'placeholder'} message={value.description ?? ' placeholder'}  />
                        )) : <p>Cargando...</p>}
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    )
};
