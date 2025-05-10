import { useState } from "react";
import { Divider, Accordion, AccordionSummary, Typography, AccordionDetails, List, Stack } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Mensaje from "./Mensaje";
import CircleIcon from '@mui/icons-material/Circle';


export type Message = {
    author: string 
    content: string
}


export default function MensajesFijados() {

    const [list, setList] = useState<Message[]>([
        { author: "Cristian", content: "Mensaje de prueba" },
        { author: "Pepe", content: "Mensaje de prueba con más texto" },
        { author: "Cristian", content: "Mensaje de prueba" },
        { author: "Pepe", content: "Mensaje de prueba con más texto" },
        { author: "Cristian", content: "Mensaje de prueba" },
        { author: "Pepe", content: "Mensaje de prueba con más texto" },
        { author: "Cristian", content: "Mensaje de prueba" },
        { author: "Pepe", content: "Mensaje de prueba con más texto" }
    ]);

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/5 items-start gap-2 rounded bg-white z-10">
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
                        {list.map((value, index) => (
                            <Mensaje key={index} index={index} list={list} setList={setList} author={value.author} message={value.content}  />
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    )
};
