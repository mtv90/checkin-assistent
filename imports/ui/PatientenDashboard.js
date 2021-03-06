import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Patientheader from './Patientheader';
import {Session} from 'meteor/session';
import {Link} from 'react-router-dom';

export const PatientenDashboard = (props) => {
    var Spinner = require('react-spinkit');
              
    if (!props.user) {
      return   (
        <div className="pacman-view">
            <Spinner name='pacman' color="#92A8D1" />
        </div>
      )
    }
    return (
        <div>
            <Patientheader title={`${props.user.profile.nachname}, ${props.user.profile.vorname}`}/>
            <div className="page-content-wartezimmer__sidebar">
                <div className="sidebar-button--wrapper">
                    
                    <button className="button button--link button--cancel-account" onClick={() => { Accounts.logout(); }}>logout</button>
                </div>
            </div>
            <div className="dashboard-content">
                <div className="boxed-view__dashboard">
                    <Link className="boxed-view__dashboardbox--patient" to="/meine-termine">Meine Termine</Link>
                    <Link className="boxed-view__dashboardbox--patient" to={{pathname:`/patient/${props.user._id}`, state: {_id: props.user._id}}}>Mein Konto</Link>
                </div>
            </div>
        </div>
    );
};

PatientenDashboard.propTypes = {
    user: PropTypes.object.isRequired
}

export default PatientenDashboard;
