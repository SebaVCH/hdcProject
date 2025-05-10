import { IconButton, ListItem, ListItemText } from "@mui/material";
import  DeleteIcon from '@mui/icons-material/Delete';
import { Message } from "./MensajesFijados";






export default function Mensaje({index, author, message, list, setList } : {index: number, author : string, message : string, list: Message[], setList : (a0 : Message[]) => void}) {



  const onDeleteMessage = () => {
    setList(list.filter((_, i)=> (i != index)))
  }



  return (
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={onDeleteMessage}>
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemText
          primary={message}
          secondary={author}
        />
      </ListItem>
    )    
};
