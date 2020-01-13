import './main.html';

import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';

import React from 'react';
import ReactDOM from 'react-dom';

import history from './../imports/routes/history'
import {Router} from 'react-router-dom';
import { onAuthChange, Routes, checkUserService } from '../imports/routes/routes';
import '../imports/startup/simple-schema-configuration';

import App from '../imports/ui/App';
import Loading from '../imports/ui/Loading';
import moment from 'moment';
import {Session} from 'meteor/session';

Tracker.autorun(() => {

  const isAuth = !!Meteor.userId();
  onAuthChange(isAuth);
  
});

let handle = Meteor.subscribe('user');
Tracker.autorun(() => {
  if(handle.ready()) {
    let user = Meteor.user();
    checkUserService(user);
  }
  
})

Tracker.autorun((run) => {
  // const admin = Roles.userIsInRole(Meteor.userId(), 'admin');
  // const patient = Roles.userIsInRole(Meteor.userId(), 'patient');
  
  if(!run.firstRun){

    Session.set({
      // admin: admin,
      // patient: patient,
      isOpen: false,
      start: moment().format('YYYY-MM-DDTHH:mm:ss'),
      end: moment().add(30, 'm').format('YYYY-MM-DDTHH:mm:ss')
    });
  }
});

Tracker.autorun(() => {
  const selectedTerminId = Session.get('selectedTerminId');
  if(selectedTerminId) {
    history.replace(`/meine-termine/${selectedTerminId}`);
  }
})

Tracker.autorun(() => {
  const selectedPraxisId = Session.get('selectedPraxisId');
  if(selectedPraxisId) {
    history.replace(`/praxisverwaltung/${selectedPraxisId}`);
  }
})

Accounts.onEmailVerificationLink((token, done) => {
  Accounts.verifyEmail(token, (error) => { 
    console.log(error);
  });
});

Meteor.startup(() => {
  Session.set({
    selectedTerminId: undefined,
    selectedPraxisId: undefined,
    start: moment().format('YYYY-MM-DDTHH:mm:ss'),
    end: moment().add(30, 'm').format('YYYY-MM-DDTHH:mm:ss')
  })
  
  ReactDOM.render(<Loading/>, document.getElementById('app'));
  
  window.setTimeout(() => {
    ReactDOM.render(
      // <Router history={history}>
      //   <App/>
      // </Router>
      Routes
      , document.getElementById('app'));
  }, 1000);

});
