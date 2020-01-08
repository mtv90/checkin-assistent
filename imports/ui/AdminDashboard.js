import React from 'react';
import {Link} from 'react-router-dom';


// import history from '../routes/history';
import PrivateHeader from './PrivateHeader';


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