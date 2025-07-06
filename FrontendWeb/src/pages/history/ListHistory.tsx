import { Checkbox, Divider, FormControl, FormControlLabel,  List,  ListItem,  ListItemText,  ListSubheader, Typography, useMediaQuery, useTheme } from "@mui/material";
import { TRoute } from "../../api/services/RouteService";
import ListDateItem from "./ListDateItem";
import { THelpPoint } from "../../api/services/HelpPointService";
import ComboBox from "../../component/Button/ComboBox";



type ListHistoryProps = {
    stateOnlyUser : [ boolean, React.Dispatch<React.SetStateAction<boolean>>]
    stateRoutes : [ Map<string, TRoute[]>, React.Dispatch<React.SetStateAction<Map<string, TRoute[]>>> ]
    stateHelpPoints : [ THelpPoint[], React.Dispatch<React.SetStateAction<THelpPoint[]>> ] 
    stateShowLocation : [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
    stateLocation : [ number[], React.Dispatch<React.SetStateAction<number[]>> ] 
    stateOPFecha : [ string, React.Dispatch<React.SetStateAction<string>> ]
}

export default function ListHistory({ stateRoutes, stateHelpPoints, stateShowLocation, stateLocation, stateOPFecha, stateOnlyUser } : ListHistoryProps) {

    const [ routes,  ] = stateRoutes
    const [ opFecha, setOPFecha ] = stateOPFecha
    const [ onlyUser, setOnlyUser ] = stateOnlyUser

    
    return (
        <List 
            sx={{ width : '100%', maxHeight: "100%", bgcolor : 'background.paper', overflowY : 'auto'}}
            component={"div"}
            aria-labelledby="route-list"
            subheader={
                <ListSubheader component={"div"} id="route-list-title" sx={{ padding : 0}}>
                    <div className={"flex flex-col gap-2 py-3 my-0 md:my-3 "}>
                        <Typography color="black" sx={{ paddingX : 3 }} variant="h6">
                            Historial de rutas  
                        </Typography>
                        <Divider />
                        <FormControl>
                            <div className="px-3">
                                <ComboBox 
                                    size="small"
                                    className="pt-3"
                                    disableClearable 
                                    includeInputInList 
                                    fullWidth 
                                    label={"Agrupar por"} 
                                    options={['Día', 'Semana', 'Mes']} 
                                    value={opFecha} 
                                    onChange={(_, value) => {setOPFecha(value as string)}}
                                    />
                                    <FormControlLabel                                
                                        value={onlyUser}
                                        control={<Checkbox onChange={(e : React.ChangeEvent<HTMLInputElement>) => {setOnlyUser(e.target.checked)}} size="small" />}
                                        label='Ver solo mis rutas'
                                        labelPlacement="end" 
                                    />
                            </div>
                        </FormControl>
                        <Divider variant='fullWidth' />
                    </div>
                </ListSubheader>
            }
        >
            {   Array.from(routes.entries()).length === 0 ? 
                <ListItem>
                    <ListItemText className="text-center" secondary={'Puedes empezar a crear rutas desde la página principal'} >
                       { onlyUser ? 'No hay rutas registradas' : ' No se registraron rutas'}
                    </ListItemText>
                </ListItem>
                :
                Array.from(routes.entries()).map(([date, routes ], index) => (
                    <ListDateItem
                        onlyUser={onlyUser}
                        stateLocation={stateLocation} 
                        stateShowLocation={stateShowLocation} 
                        stateHelpPoints={stateHelpPoints} 
                        routes={routes} 
                        date={date} 
                        key={date} 
                        defaultOpen={index == 0} 
                        sx={{
                            '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'white',
                            },
                            '&.Mui-selected:hover': {
                            backgroundColor: 'primary.dark',
                            },
                        }}
                    />
            ))}
        </List>
    )
};
