import { Button, IconButton, ListItem, ListItemText, Typography } from "@mui/material";
import  DeleteIcon from '@mui/icons-material/Delete';
import { TNotice } from "../api/services/NoticeService";
import { useState } from "react";
import { formatRelative } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";






export default function Mensaje({ value, index } : { value : TNotice, index : number }) {

  const MAX_LENGTH = 100
  const [ msg, setMsg ] = useState(value.description as string)
  const [ isTruncated, setIsTruncated ] = useState(msg.length > MAX_LENGTH)
  const [ toggleIsShowingMore, setIsShowingMore ] = useState(false)
  
  


  return (
    <ListItem key={index}>
      <ListItemText
        primary={
            <React.Fragment >
                <div className="flex flex-row gap-3" >
                    <Typography
                        component={"span"}
                        variant='body2'
                        sx={{ color : 'text.primary'}}
                    >
                        {value.authorName}
                    </Typography>
                    <Typography
                        lineHeight={1.7}
                        component={"span"}
                        variant="caption"
                        sx={{ color : 'text.secondary', textAlign : 'end', my : 0.05}}
                    >
                        {formatRelative(new Date(value.createdAt as string), new Date(), { locale : es })}
                    </Typography>
                </div>
            </React.Fragment>
        }
        secondary={
          <React.Fragment>
              <div className="p-4 pb-0 text-justify">
                  <Typography
                      component={"span"}
                      variant='body1'
                      sx={{ color : 'text.primary', display : 'inline'}}
                  >
                      { isTruncated && !toggleIsShowingMore ? 
                          msg.slice(0, MAX_LENGTH) + '... ' 
                          :
                          msg + ' '
                      }
                  </Typography>   
                  { isTruncated ? 
                    <button className="text-green-700 underline cursor-pointer" onClick={() => setIsShowingMore(prev => !prev)} >
                      { toggleIsShowingMore ? 'Ver menos' : 'Ver más' }  
                    </button>  
                    :
                    <></>
                  }
              </div>      
          </React.Fragment>
        }
      />
    </ListItem>
  )    
};
