import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState } from 'react'
import { DateSelectArg, EventClickArg, EventSourceInput } from '@fullcalendar/core'
import { Button, Divider, IconButton, Popover, Tooltip, Typography } from '@mui/material'
import esLocale from '@fullcalendar/core/locales/es';
import { isSingleDaySelection } from '../utils/calendar'
import DialogCreateEventCalendar from './Dialog/DialogCreateEventCalendar'
import { CalendarAdapter } from '../api/adapters/CalendarAdapter'
import useSessionStore from '../stores/useSessionStore'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { EventImpl } from '@fullcalendar/core/internal'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function Calendar() {

    const { accessToken } = useSessionStore()
    const [selectInfo, setSelectInfo] = useState<DateSelectArg | null>(null)

    const [open, setOpen] = useState(false)

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        setSelectInfo(selectInfo)
        setOpen(true)
    };

    const { isError, isPending, isSuccess, data, error} = CalendarAdapter.useGetEventCalendar(accessToken)
    
    
    const [ eventClicked, setEventClicked ] = useState<EventImpl | undefined>(undefined)
    const [ anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const openPopover = Boolean(anchorEl)
    const id =  openPopover ? 'view-event-popover' : undefined

    const handleCloseEventView = () => {
        setAnchorEl(null)
        setEventClicked(undefined)
    }


    useEffect(() => {
        if(isSuccess) {
            console.log("aca en calendar: ", data)
        }
    }, [data])

    const handleEventClick = (clickInfo : EventClickArg) => {
        setAnchorEl(clickInfo.el)
        setEventClicked(clickInfo.event)
    };

    return (
        <div className='flex flex-col flex-nowwrap justify-center items-start gap-5'>
            <div className='px-10'>
                <FullCalendar 
                    plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth'
                    }}
                    initialView="dayGridMonth"
                    firstDay={1}
                    height="auto" 
                    contentHeight="auto"
                    selectMirror={true}
                    dayMaxEvents={true}
                    unselectAuto
                    locale={esLocale}
                    events={data?.map((event, index) => ({
                        id : event._id,
                        date : new Date(event.dateStart),
                        title : event.title,
                        allDay : true,

                    }))}
                    select={handleDateSelect}
                    selectable={true}
                    selectAllow={isSingleDaySelection}
                    displayEventTime={false}
                    eventClick={handleEventClick}
                />
            </div>
            <div className='flex w-full justify-start items-start px-10'>
                <Button variant='contained'>
                    Sincronizar Con Google Calendar
                </Button>
            </div>
            <DialogCreateEventCalendar stateOpen={[open, setOpen]} stateSelectInfo={[selectInfo, setSelectInfo]}  />
            <Popover
                id={id}
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handleCloseEventView}
                anchorOrigin={{ vertical: "center", horizontal: "right" }}
                transformOrigin={{ vertical: "center", horizontal: "left" }}
                marginThreshold={16}
                slotProps={{
                    paper: {
                        elevation : 6,
                        sx : {
                            borderRadius : 10,
                            bgcolor : '#f0f4f9',
                            marginTop: 1,
                            width : 400,
                            minHeight : 200,
                            maxHeight : 500 ,
                            overflowY: 'auto'
                        }
                    },
                }}
            >
                <div className="flex flex-row justify-end items-center py-3 px-5">
                    <div className='flex flex-row gap-5'>
                        <div className='flex flex-row gap-1'>
                            <Tooltip title={'Eliminar Evento'}>
                                <IconButton>
                                    <EditIcon htmlColor="black" fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={'Editar Evento'}>
                                <IconButton>
                                    <DeleteIcon htmlColor="black" fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <Tooltip title={'Cerrar'}>
                            <IconButton onClick={handleCloseEventView}>
                                <CloseIcon htmlColor="black" fontSize="small" />
                            </IconButton>
                        </Tooltip>

                    </div>
                </div>
                <div className='flex flex-col py-5 px-8 gap-2'>
                    <Typography variant='h6'>
                        {eventClicked?.title}
                    </Typography>
                    <Typography>
                        {   eventClicked?.start ? 
                            format(eventClicked.start, "EEEE, dd 'de' MMMM", { locale : es})
                            :
                            null
                        }
                    </Typography>
                </div>
            </Popover>
        </div>
    )  
};


/* 
    const handleSubmitEvent = () => {
        if(!selectInfo) return
        if(!startTime) return 
        if(!endTime) return 
        if(!title) return 

        selectInfo.view.calendar.addEvent({
            id: '123',
            title: `${startTime} - ${endTime} | ${title}`,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: true,
            color: 'red'
        })
        selectInfo.view.calendar.unselect();
        handleClose();
    }
*/