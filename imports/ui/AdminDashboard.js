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

export default () => {
    return (
        <div className="">
            <PrivateHeader title="Admin" />
            <AddTermin />
            <TerminListe/>
        </div>
        )
    }