import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import history from '../routes/history';
import {Termine} from '../api/termine';
import {Link} from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import {Session} from 'meteor/session';
import PatTerminItem from './PatTerminItem';
import FlipMove from 'react-flip-move';
import AddPraxis from './AddPraxis';
import Praxis from './Praxis';

const renderPraxen = (props) => {
    if(props.praxen.length != 0){
        console.log(props.praxen.length)
        
    } else {
        return 
    }
}
export const Patiententerminliste = (props) => {
    
    return (
        <div className="praxisliste">
            <div className="sidebar-button--wrapper">
            
                <Link className="button button--link button--dashboard" to={{pathname: `/dashboard`}}>Dashboard</Link>
            
                <button className="button button--link button--dashboard" onClick={() => { Accounts.logout(); history.replace('/'); }}>logout</button>
            </div>
            {/* <AddPraxis/> */}
            <h2 className="item-title">Meine Termine</h2>
            <FlipMove maintainContainerHeight={true}>
                {props.patiententermine.map( (termin) => {
                    return <PatTerminItem key={termin._id} termin={termin}/> 
                })}
            </FlipMove>
        </div>
    );
};

export default withTracker( () => {
    const selectedTerminId = Session.get('selectedTerminId');
    
    Meteor.subscribe('patiententermine');
        return {
            patiententermine: Termine.find({}, {sort: {start: 1}}).fetch().map( (termin) => {
                return {
                    ...termin,
                    selected: termin._id === selectedTerminId
                }
            }),
            Session
        };   
})(Patiententerminliste);