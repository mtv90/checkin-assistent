import React from 'react';
import {Link} from 'react-router-dom';
import { withTracker  } from 'meteor/react-meteor-data';
import {Praxen} from '../api/praxen';

// import history from '../routes/history';
import PrivateHeader from './PrivateHeader';
import ChangePraxis from './ChangePraxis';

const renderTitle= (props) => {
    if(props.my_praxis){
        return props.my_praxis.title;
    } else {
        return `${props.user.profile.nachname}, ${props.user.profile.vorname}`;
    }
}
const checkSelected = (props) => {
    if(props.my_praxis){
       return (props.my_praxis.selected ? true : false);
    } else {
        return false
    }
}

const getPraxis = (props) => {
    if(props.my_praxis){
        return props.my_praxis
    }
    return {};
}

export const AdminDashboard = (props) => {
    
    return (
        <div className="" >
            <PrivateHeader title={renderTitle(props)}/>
            <ChangePraxis/>
            <div className="dashboard-content">
                <div className="boxed-view__dashboard">
                                          
                    {checkSelected(props) ? <Link className='boxed-view__dashboardbox' to={{pathname: `/dashboard/${props.praxisId}/termine`}}><h3>Mein Kalender</h3></Link> : undefined}
                    {checkSelected(props) ? <Link className='boxed-view__dashboardbox' to={{pathname: `/dashboard/${props.praxisId}/wartezimmer`}}><h3>Mein Wartezimmer</h3></Link> : undefined}
                    {checkSelected(props) ? <Link className='boxed-view__dashboardbox' to={{pathname: `/patienten/${props.praxisId}`}}><h3>Meine Patienten</h3></Link> : undefined}
                    
                    <Link className="boxed-view__dashboardbox" to="/praxisverwaltung"><h3>Praxisverwaltung</h3></Link>
                </div>
            </div>
        </div>
    )
}

export default withTracker( () => {
    const praxisId = Session.get('praxisId');
    Meteor.subscribe('meine_praxen');
    const praxis = Praxen.findOne(praxisId);
    if(praxis){
        return { 
            praxisId, 
            my_praxis: { 
                ...praxis,
                selected: praxis._id === praxisId 
            }
        };
    } else{
        return {praxisId}
    }
})(AdminDashboard);