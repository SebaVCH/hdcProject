import { Checkbox, Collapse, Divider, FormControl, FormControlLabel, FormGroup, InputLabel, List, ListItemButton, ListItemText, ListSubheader, Select, Typography } from "@mui/material";
import { TRoute } from "../../api/services/RouteService";
import ListDateItem from "./ListDateItem";
import { THelpPoint } from "../../api/services/HelpPointService";
import { useEffect, useState } from "react";
import ComboBox from "../../component/Button/ComboBox";



type ListHistoryProps = {
    stateRoutes : [ Map<string, TRoute[]>, React.Dispatch<React.SetStateAction<Map<string, TRoute[]>>> ]
    stateHelpPoints : [ THelpPoint[], React.Dispatch<React.SetStateAction<THelpPoint[]>> ] 
    stateShowLocation : [ boolean, React.Dispatch<React.SetStateAction<boolean>> ]
    stateLocation : [ number[], React.Dispatch<React.SetStateAction<number[]>> ] 
    stateOPFecha : [ string, React.Dispatch<React.SetStateAction<string>> ]
}

export default function ListHistory({ stateRoutes, stateHelpPoints, stateShowLocation, stateLocation, stateOPFecha } : ListHistoryProps) {

    const [ routes, setRoutes ] = stateRoutes
    const [ opFecha, setOPFecha ] = stateOPFecha
    const [ onlyUser, setOnlyUser ] = useState(false)

    return (
        <List 
            sx={{ width : '100%', maxHeight: "100%", bgcolor : 'background.paper', overflowY: "auto"}}
            component={"div"}
            aria-labelledby="route-list"
            subheader={
                <ListSubheader component={"div"} id="route-list-title" sx={{ padding : 0}}>
                    <div className="flex flex-col gap-2 py-3 my-2">
                        <Typography sx={{ paddingX : 3}} variant="h6">
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
                                    onChange={(e, value) => {setOPFecha(value as string)}}
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
            { Array.from(routes.entries()).map(([date, routes ], index) => (
                <ListDateItem 
                  onlyUser={onlyUser}
                  stateLocation={stateLocation} 
                  stateShowLocation={stateShowLocation} 
                  stateHelpPoints={stateHelpPoints} 
                  routes={routes} 
                  date={date} 
                  key={date} 
                  defaultOpen={index == 0} 
                />
            ))}
        </List>
    )
};
