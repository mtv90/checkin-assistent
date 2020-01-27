import './main.html';

import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import { Accounts } from 'meteor/accounts-base';
import React from 'react';
import ReactDOM from 'react-dom';

import history from './../imports/routes/history'
import {Router} from 'react-router-dom';
import { onAuthChange, Routes, checkUserService } from '../imports/routes/routes';
import Route from '../imports/routes/routes';
import '../imports/startup/simple-schema-configuration';

import App from '../imports/ui/App';
import Loading from '../imports/ui/Loading';
import moment from 'moment';
import {Session} from 'meteor/session';
import swal from 'sweetalert';

Tracker.autorun(() => {

  const isAuth = !!Meteor.userId();
  
  onAuthChange(isAuth);

});

let handle = Meteor.subscribe('user');
Tracker.autorun(() => {
  if(handle.ready()) {
    let user = Meteor.users.findOne({_id: Meteor.userId()}, {fields:{services: 0, createdAt: 0}});
    
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

// Implementierung, gemäß Datenschutz, wenn der Patient >= 10 min inaktiv war, meldet sich das System automatisch ab 
var html5api = new Html5Api();
var logTimer;
var pageVisibility = html5api.pageVisibility();
Tracker.autorun(() => {
  if(pageVisibility && Roles.userIsInRole(Meteor.userId(), 'patient')){
    pageVisibility.onChange(() => {
      switch (!(history.location.pathname === '/signup') || !(history.location.pathname === '/')) {
        
        case (pageVisibility.state() === 'hidden'):
            
            logTimer = setTimeout(function(props){
              Accounts.logout();
              swal("Sitzung abgelaufen", "Das System hat Sie wegen Inaktivität abgemeldet", "danger")         
            }, 600000);
          break;
      
        case (pageVisibility.state() === 'visible'):
          console.log(000)
            clearTimeout(logTimer);
          break;
        default: 
          break;
      }
    });
  }


  //   pageVisibility.onChange(function (props) {
  //     console.log("The Current Page Visibility is " + pageVisibility.state(), props);
  //     var logTimer;
      
  //     console.log(Session.get('timer'));

  // });

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
    isOpen: false,
    // praxisId: undefined,
    praxisId_termin: undefined,
    praxisId_warte: undefined,
    termin_path: undefined,
    wartezimmer_path: undefined,
    start: moment().format('YYYY-MM-DDTHH:mm:ss'),
    end: moment().add(30, 'm').format('YYYY-MM-DDTHH:mm:ss')
  })
  // Session.setDefault( 'praxisId', undefined)
  // if(!this.user){
  //   ReactDOM.render(<Loading/>, document.getElementById('app'));
  // }
  
  window.setTimeout(() => {
    ReactDOM.render(
      // <Router history={history}>
      //   <App/>
      // </Router>
      Routes
      , document.getElementById('app'));
  }, 1000);


});
