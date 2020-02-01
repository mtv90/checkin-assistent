import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Termine} from '../api/termine';
import PatTerminItem from './PatTerminItem';
import {Session} from 'meteor/session';
import Patientheader from './Patientheader';
import FlipMove from 'react-flip-move';
import AccountDatenListe from './AccountDatenListe';
import Editor from './Editor';

export const Account = (props) => {
    
    return (
        <div>
            <Patientheader title={`${Session.get('user').profile.nachname}, ${Session.get('user').profile.vorname}`}/>
            <div className="page-content editor-container">
                <div className="page-content__sidebar">
                    {/* <FlipMove maintainContainerHeight={true}>
                        {props.patiententermine.map( (termin) => {
                            return <PatTerminItem key={termin._id} termin={termin}/> 
                        })}
                    </FlipMove> */}
                    <AccountDatenListe/>
                </div>
                <div className="page-content__main">
                    <AccountEditor/>
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
})(Account);
