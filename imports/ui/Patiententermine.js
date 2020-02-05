import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Termine} from '../api/termine';
import PatTerminItem from './PatTerminItem';
import {Session} from 'meteor/session';
import Patientheader from './Patientheader';
import FlipMove from 'react-flip-move';
import Patiententerminliste from './Patiententerminliste';
import Editor from './Editor';

export const Patiententermine = (props) => {
    
    return (
        <div>
            <Patientheader title={`${Session.get('user').profile.nachname}, ${Session.get('user').profile.vorname}`}/>
            <div className="page-content editor-container">
                <div className="page-content__sidebar">
                    <Patiententerminliste/>
                </div>
                <div className="page-content__main">
                    <Editor/>
                </div>
            </div>
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
})(Patiententermine);
