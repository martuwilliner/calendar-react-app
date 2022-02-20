import React, { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/es";
import moment from "moment";
import { Navbar } from "../ui/Navbar";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { messages } from "../../helpers/calendar-messages";
import { CalendarEvent } from "./CalendarEvent";
import { CalendarModal } from "./CalendarModal";
import { useDispatch } from "react-redux";
import { uiOpenModal } from "../../actions/ui";
import { eventClearActiveEvent, eventSetActive } from "../../actions/events";
import { AddNewFab } from "../ui/AddNewFab"
import { useSelector } from "react-redux";
import { DeleteEventFab } from "../ui/DeleteEventFab";

moment.locale("es");

const localizer = momentLocalizer(moment);

export const CalendarScreen = () => {
  const dispatch = useDispatch();

  const { events, activeEvent } = useSelector(state => state.calendar);

  //varible para mantener estado para cuando cambie, mantenga las cosas de la ultima visita:
  const [lastView, setLastView] = useState(localStorage.getItem('ultimaVista') || 'month' )

  const onDoubleClick = (e) => {
    dispatch(uiOpenModal())
  };

  const onSelect = (e) => {
    dispatch(eventSetActive(e))
    
  };

  // con esto capturamos la ultima visita (e) para luego usar el useState de arriba
  const onViewChange = (e) => {
    setLastView(e);
    localStorage.setItem('ultimaVista', e)
  };

  const onSelectSlot = (e) => {
    dispatch(eventClearActiveEvent())
  }

  const eventStyleGetter = (event, start, end, isSelected) => {

    const style={
      backgroundColor: '#367cf7',
      borderRadius: '0px',
      opacity: 0.8,
      display: 'block',
      color: 'white'
    }
    return style;
  }

  return (
    <div className="calendar-screen">
      <Navbar />

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChange}
        view={lastView}
        onSelectSlot={onSelectSlot}
        selectable={true}
      />

      <AddNewFab/>
      {
        (activeEvent) && <DeleteEventFab/>
      }

      <CalendarModal/>
    </div>
  );
};
