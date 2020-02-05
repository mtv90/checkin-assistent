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


export const Patiententerminliste = (props) => {
    
    return (
        <div className="praxisliste">
            <div className="sidebar-button--wrapper">
            
                <Link className="button button--link button--cancel-account" to={{pathname: `/dashboard`}}>Dashboard</Link>
            
                <button className="button button--link button--cancel-account" onClick={() => { Accounts.logout(); history.replace('/'); }}>logout</button>
            </div>
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