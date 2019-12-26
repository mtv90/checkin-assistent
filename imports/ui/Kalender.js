import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment'
import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css';

class Kalender extends React.Component {
    calendarComponentRef = React.createRef()
  constructor(props) {
    super(props)
    this.state = {
        myEventsList: [],
    }

  }


  render() {
    return (
        <div>
        <FullCalendar
        defaultView="timeGridWeek"
        minTime= '08:00:00'
        maxTime= '16:00:00'
        header={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
        ref={ this.calendarComponentRef }
        weekends={ this.state.calendarWeekends }
        events={ this.state.calendarEvents }
        dateClick={ this.handleDateClick }
        />
      </div>
    )
  }
}

export default Kalender