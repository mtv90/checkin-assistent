import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import Patientheader from './Patientheader';
import Praxisliste from './Praxisliste';
// import Praxisview from './Praxisview';
import PropTypes from 'prop-types';

export const Praxisverwaltung = (props) => {
    return (
        <div>
            <Patientheader title={`${Session.get('user').profile.nachname}, ${Session.get('user').profile.vorname}`}/>
            <Praxisliste />
            {/* <Praxisview /> */}
        </div>
    )
}
export default Praxisverwaltung;