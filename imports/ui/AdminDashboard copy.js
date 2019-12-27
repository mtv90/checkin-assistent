import React from 'react';


import history from '../routes/history';
import Kalender from './Kalender';
import Termin from './Termin';
import TerminListe from './TerminListe';
import PrivateHeader from './PrivateHeader';
import AddTermin from './AddTermin';
import {Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'


export default class AdminDashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            error: '',
            localizer: momentLocalizer(moment),
            myEventsList: [
                {
                    id: 0,
                    title: 'Board meeting',
                    start: new Date(2018, 0, 29, 9, 0, 0),
                    end: new Date(2018, 0, 29, 13, 0, 0),
                    resourceId: 1,
                  },
                  {
                    id: 1,
                    title: 'MS training',
                    allDay: true,
                    start: new Date(2018, 0, 29, 14, 0, 0),
                    end: new Date(2018, 0, 29, 16, 30, 0),
                    resourceId: 2,
                  },
                  {
                    id: 2,
                    title: 'Team lead meeting',
                    start: new Date(2018, 0, 29, 8, 30, 0),
                    end: new Date(2018, 0, 29, 12, 30, 0),
                    resourceId: 3,
                  },
                  {
                    id: 11,
                    title: 'Birthday Party',
                    start: new Date(2018, 0, 30, 7, 0, 0),
                    end: new Date(2018, 0, 30, 10, 30, 0),
                    resourceId: 4,
                  },
            ]
        }     
    }

    render(){
        return (
            <div className="">
                <PrivateHeader title="Admin" />
                <TerminListe/>
                <AddTermin />
                
                {/* <Calendar
                localizer={this.state.localizer}
                events={this.state.myEventsList}
                startAccessor="start"
                endAccessor="end"
                /> */}
            </div>
        )
    }
}