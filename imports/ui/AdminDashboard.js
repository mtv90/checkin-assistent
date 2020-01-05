import React from 'react';
import {Link} from 'react-router-dom';


import history from '../routes/history';
import Kalender from './Kalender';
import Termin from './Termin';

import PrivateHeader from './PrivateHeader';

import {Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

export default () => {
    return (
        <div className="">
            <PrivateHeader title="Admin" />
            <div className="dashboard-content">
                <div className="boxed-view__dashboard">
                    <Link className="boxed-view__dashboardbox" to="/termine"><h3>Mein Kalender</h3></Link>
                    <Link className="boxed-view__dashboardbox" to="/wartezimmer"><h3>Mein Wartezimmer</h3></Link>
                    <Link className="boxed-view__dashboardbox" to="/patienten"><h3>Meine Patienten</h3></Link>
                </div>
            </div>
        </div>
        )
    }