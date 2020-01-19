import './main.html';

import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';

import React from 'react';
import ReactDOM from 'react-dom';

import history from './../imports/routes/history'
import {Router} from 'react-router-dom';
import { onAuthChange, Routes, checkUserService, goBack } from '../imports/routes/routes';
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
 
  if(!run.firstRun){

    Session.set({
    
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
  Session.set('isNavOpen', false);
  if(selectedPraxisId) {
    history.replace(`/praxisverwaltung/${selectedPraxisId}`);
  }
})

Tracker.autorun(() => {
  
  const praxisId = Session.get('praxisId');
  const dashboard_path = Session.get('dashboard_path');
    if(praxisId && dashboard_path === '/dashboard/:id') {
      history.replace(`/dashboard/${praxisId}`);
    } 
  
});

Tracker.autorun(() => {
  const isNavOpen = Session.get('isNavOpen');
  document.body.classList.toggle('is-nav-open', isNavOpen);
})

Tracker.autorun(() => {
  const praxisId_termin = Session.get('praxisId_termin');
  const termin_path = Session.get('termin_path')
  if(praxisId_termin && termin_path === '/dashboard/:id/termine') {
    history.replace(`/dashboard/${praxisId_termin}/termine`);
  } 
});

Tracker.autorun(() => {
  const praxisId_warte = Session.get('praxisId_warte');
  const wartezimmer_path = Session.get('wartezimmer_path')
  if(praxisId_warte && wartezimmer_path === '/dashboard/:id/wartezimmer') {
    history.replace(`/dashboard/${praxisId_warte}/wartezimmer`);
  } 
});

Accounts.onEmailVerificationLink((token, done) => {
  Accounts.verifyEmail(token, (error) => { 
    console.log(error);
  });
});

Meteor.startup(() => {
  Session.set({
    selectedTerminId: undefined,
    selectedPraxisId: undefined,
    isNavOpen: false,
    // praxisId: undefined,
    praxisId_termin: undefined,
    praxisId_warte: undefined,
    termin_path: undefined,
    wartezimmer_path: undefined,
    start: moment().format('YYYY-MM-DDTHH:mm:ss'),
    end: moment().add(30, 'm').format('YYYY-MM-DDTHH:mm:ss')
  })
  // Session.setDefault( 'praxisId', undefined)
  
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
