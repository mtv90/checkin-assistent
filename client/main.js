import './main.html';

import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';

import React from 'react';
import ReactDOM from 'react-dom';

import history from './../imports/routes/history'
import {Router} from 'react-router-dom';
import { onAuthChange, verifiedUser } from '../imports/routes/routes';
import '../imports/startup/simple-schema-configuration';

import App from '../imports/ui/App';

import moment from 'moment';
import {Session} from 'meteor/session';
import swal from 'sweetalert';


Tracker.autorun(() => {
  const isAuth = !!Meteor.userId();
  onAuthChange(isAuth);
});

Tracker.autorun(() => {
  Meteor.subscribe('isVerified');
  const user = Meteor.users.findOne({_id: Meteor.userId()});
  if(user) {
    Session.set('verified', user.emails[0].verified)
  }

});

Tracker.autorun(() => {
  const admin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const patient = Roles.userIsInRole(Meteor.userId(), 'patient');
  
  Session.set('admin', admin);
  Session.set('patient', patient);
  Session.set('isOpen', false);
  Session.set({
    start: moment().format('YYYY-MM-DDTHH:mm:ss'),
    end: moment().add(30, 'm').format('YYYY-MM-DDTHH:mm:ss')
  });

});

Accounts.onEmailVerificationLink((token, done) => {
  Accounts.verifyEmail(token, (error) => { 
    console.log(error);
  });
});

Meteor.startup(() => {

  ReactDOM.render(
    <Router history={history}>
      <App/>
    </Router>
    , document.getElementById('app'));
})
