import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState } from 'react'
import { CalendarApi, DateSelectArg, EventInput } from '@fullcalendar/core'
import { Card, Input, Button, TextField } from '@mui/material'
import ComboBox from './Button/ComboBox'



const timeSlots = Array.from(new Array(24 * 2)).map(
  (_, index) =>
    `${index < 20 ? '0' : ''}${Math.floor(index / 2)}:${
      index % 2 === 0 ? '00' : '30'
    }`,
);

export default function Calendar() {

    const [calendarAPI, setCalendarAPI] = useState<CalendarApi | null>(null);
    const [selectInfo, setSelectInfo] = useState<DateSelectArg | null>(null); // Almacena toda la info de selección
    const [title, setTitle] = useState('');
    const [open, setOpen] = useState(false);
    const [startTime, setStartTime] = useState<string>();
    const [endTime, setEndTime] = useState<string>();
    const [listEndTime, setListEndTime] = useState<string[]>([]);

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        setSelectInfo(selectInfo); // Guardamos toda la información de selección
        setCalendarAPI(selectInfo.view.calendar);
        setOpen(true);
    };

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

    const handleClose = () => {
        setOpen(false);
        setTitle('');
        setStartTime(undefined);
        setEndTime(undefined);
        if (selectInfo) {
            selectInfo.view.calendar.unselect();
        }
    }

    const getEndTime = (indexStart : number) => (
        timeSlots.filter((_, index) => ( index > indexStart ))
    )

    useEffect(() => {
        if(startTime) {
            const index = timeSlots.indexOf(startTime)
            setListEndTime(getEndTime(index))
            setEndTime(timeSlots[index + 1])
        }
    }, [startTime])

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
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    unselectAuto
                    
                    // initialEvents={dateEvents} // alternatively, use the `events` setting to fetch from a feed
                    select={handleDateSelect}
                />
            </div>
            <div className='flex w-full justify-start items-start px-10'>
                <Button variant='contained'>
                    Sincronizar Con Google Calendar
                </Button>
            </div>
            { open ? 
                <div className='w-full max-w-6xl px-10'>
                    <Card className="transition-all transition-discrete flex flex-row gap-6 p-8 shadow-md rounded-2xl" style={{backgroundColor: "#fafafa"}}>
                        <div className="flex grow-2 flex-col gap-2">
                            <label htmlFor="titulo" className="text-sm font-medium text-gray-700">
                                Título
                            </label>
                            <TextField
                                id="titulo"
                                type="titulo"
                                placeholder="Agrega un título"
                                value={title}
                                onChange={(e) => {setTitle(e.target.value)}}
                            />
                        </div>
                        <div className="flex flex-col w-75 gap-2">
                            <label htmlFor="horario" className="text-sm font-medium text-gray-700">
                                Horario
                            </label>
                            <div className='flex flex-row gap-4 justify-center items-center'>
                                <ComboBox  onChange={(e, value) => {setStartTime(value as string)}} label='Empieza' options={timeSlots} />
                                <p>-</p>
                                <ComboBox  onChange={(e, value) => {setEndTime(value as string)}} disabled={startTime == undefined} label='Termina' options={listEndTime as string[]}/>
                            </div>
                        </div>
                        <div className='flex justify-end items-end'>
                            <Button type="submit" onClick={handleSubmitEvent}>
                                Ingresar
                            </Button>
                        </div>
                    </Card>
                </div>
                : 
                <></>
            }
        </div>
    )

    
};




/**
 *


    const [ dateEvents, setDateEvents ] = useState<EventInput[]>([
        {
        id: '123',
        title: 'Reunión importante',
        start: '2025-05-20T10:30:00',
        end: '2025-05-20T12:00:00',
        allDay: false,
        url: 'https://example.com/meeting',
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
        borderColor: '#1d4ed8',
        classNames: ['important-meeting'],
        extendedProps: {
            location: 'Sala de conferencias A',
            organizer: 'Juan Pérez',
            description: 'Revisión del proyecto X con el equipo'
        },
        editable: true,
        overlap: false,
        display: 'auto'
        }
    ])

 */