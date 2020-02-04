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
import swal2 from 'sweetalert2';
import {Termine} from '../imports/api/termine';
import { Behandlungen } from '../imports/api/behandlungen';

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

// Tracker.autorun((run) => {
//     console.log(Session.get('isOpen'))
//     // Session.set({
    
//     //   isOpen: Session.get('isOpen'),
//       // start: moment().format('YYYY-MM-DDTHH:mm:ss'),
//       // end: moment().add(30, 'm').format('YYYY-MM-DDTHH:mm:ss')
//     // });
  
// });

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
  const selectedTerminId = Session.get('selectedTerminId');
  Session.set('isNavOpen', false);
  if(selectedTerminId) {
    history.replace(`/meine-termine/${selectedTerminId}`);
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
  const selectedKontoDetails = Session.get('selectedKontoDetails');
  if(selectedKontoDetails){
    history.replace(`/patient/${Meteor.userId()}/${selectedKontoDetails}`)
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

Tracker.autorun(() => {

  
  const praxisId = Session.get('praxisId')
  if(Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'admin')){
    const termine = Termine.find({$and: [{"praxis.mitarbeiter._id": Meteor.userId()}, {"praxis._id": praxisId},{"adminRead": false} ]}).fetch();
    termine.map(termin => {

      if(termin.adminRead === false){
        let title = '';
        let sub = '';
        
        if (termin.status === 'storniert') {
          console.log('storniert')
          title = `Termin-Update: Storno`;
          sub = `Patient/in ${termin.patient.profile.vorname} ${termin.patient.profile.nachname} hat den Termin abgesagt.`
        }
        if (termin.status === 'verspaetet') {
          console.log('verspätet')
          title = `Termin-Update: Verspätung`;
          sub = `Patient/in ${termin.patient.profile.vorname} ${termin.patient.profile.nachname} verspätet sich.`
        } 
        if (termin.status === 'waiting') {
          title = `Termin-Update: Im Wartezimmer`;
          sub = `Patient/in ${termin.patient.profile.vorname} ${termin.patient.profile.nachname} ist eingecheckt und wartet im Wartezimmer.`  
        } 
        swal2.fire({
          position: 'top-end',
          icon: 'warning',
          title: `${title}`,
          text: `${sub}`,
          showConfirmButton: true,
          // timer: 9000,
          toast:true
        })
        .then((value) => {
          if(value){
            termin['adminRead'] = true;
            Meteor.call('termin.check', termin._id, termin,
              (err, res) => {
                if(err) {
                  swal("Fehler", `${err.error}`, "error");
                }
              });
          }
          
        })
      } 
    });
  }
  


});

const handles = [
  Meteor.subscribe('patiententermine'),
  Meteor.subscribe('getBehandlungsraum'),
]
Tracker.autorun(() => {
  const areReady = handles.every( handle => handle.ready());
  if(areReady && Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'patient')){
    const termine = Termine.find({$and: [{"patient._id": Meteor.userId()}, {patientRead: false}]}).fetch();
    
    termine.map(termin => {
      let title = '';
      let sub = '';
      if(termin.status=== 'open'){
        title = `Neuer Termin bei: ${termin.praxis.title}`;
        sub = 'Es wurde ein neuer Termin vereinbart.';
      } 
      if(termin.status=== 'storniert'){
        title = `${termin.praxis.title} - Termin-Storno: ${termin.subject}`;
        sub = `Der Termin wurde von der Praxis ${termin.praxis.title} abgesagt.`;
      }
      if(termin.status=== 'in-behandlung'){
        Meteor.subscribe('getBehandlungsraum')
        const behandlung = Behandlungen.findOne({termin_id: termin._id})
        title = `${termin.praxis.title} - Behandlung in: ${behandlung.resourceTitle}`; 
        sub = `Die Behandlung geht los! Gehen Sie in den Raum: ${behandlung.resourceTitle}`;
      }
      else {
        title = `${termin.praxis.title} - Termin-Update: ${termin.subject}`; 
        sub = `Ihr Termin wurde bearbeitet und ist im Status: ${termin.status}`;
      }
      if(termin.patientRead === false){
        swal(title, 
          sub, 
          'info', 
          {
            closeOnEsc: false,
            closeOnClickOutside: false,
            buttons: {
              cancel: {
                text: 'später ansehen',
                value: null,
                visible: true,
                closeModal: true,
              },
              catch: {
                text: "bestätigen",
                value: true
              }    
            },
          },
        ).then(value => {
          if(value){
            termin['patientRead'] = true;
            Meteor.call('termin.check', termin._id, termin,
              (err, res) => {
                if(err) {
                  swal("Fehler", `${err.error}`, "error");
                }
              })
          }
        })
      }
    })
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
    isOpen: false,
    modalIsOpen: false,
    selectedKontoDetails: false,
    praxisId_termin: undefined,
    praxisId_warte: undefined,
    termin_path: undefined,
    wartezimmer_path: undefined,
    start: moment().format('YYYY-MM-DDTHH:mm'),
    end: moment().add(30, 'm').format('YYYY-MM-DDTHH:mm')
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
