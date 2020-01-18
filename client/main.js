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

    if(praxisId) {
      history.replace(`/dashboard/${praxisId}`);
    } 
  
});

Tracker.autorun(() => {
  const isNavOpen = Session.get('isNavOpen');
  document.body.classList.toggle('is-nav-open', isNavOpen);
})
// Tracker.autorun(() => {
//   const praxisId = Session.get('praxisId');
//   if(praxisId) {
//     history.replace(`/termine/${praxisId}`);
//   } 
// });

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
    praxisId: undefined,
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
