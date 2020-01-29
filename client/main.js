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
import swal2 from 'sweetalert2'
import {Termine} from '../imports/api/termine';

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

// Tracker.autorun(() => {
//   Meteor.subscribe('termin_timer');
//   if(Meteor.userId()){
//     const termine = Termine.find({$and: [{"praxis.mitarbeiter._id": Meteor.userId()}, 
//     {"checkedIn": false} ]}).fetch();
//   }
// })

Tracker.autorun(() => {

  
  const praxisId = Session.get('praxisId_warte')
  if(praxisId && Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'admin')){
    const termine = Termine.find({$and: [{"praxis.mitarbeiter._id": Meteor.userId()}, {"praxis._id": praxisId},{"adminRead": false} ]}).fetch();
    termine.map(termin => {
      if(termin.status === 'waiting' && termin.checkedIn === true && termin.adminRead === false){
        swal2.fire({
          position: 'top-end',
          icon: 'info',
          title: `${termin.title}`,
          text: `Der Termin befindet sich im Status: ${termin.status}`,
          showConfirmButton: false,
          timer: 5000,
          toast:true
        })
        // .then((value) => {
        //   if(value){
        //     termin['adminRead'] = true;
        //     Meteor.call('termin.check', termin._id, termin,
        //       (err, res) => {
        //         if(err) {
        //           swal("Fehler", `${err.error}`, "error");
        //         }
        //       });
        //   }
          
        // })
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
        title = 'Neuer Termin';
        sub = '';
      } else {
        title = `Neues zu Ihrem Termin: ${termin.subject}`; 
        sub = `Der neue Status ihres Termins ist: ${termin.status}`;
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
    // praxisId: undefined,
    praxisId_termin: undefined,
    praxisId_warte: undefined,
    termin_path: undefined,
    wartezimmer_path: undefined,
    start: moment().format('YYYY-MM-DDTHH:mm'),
    end: moment().add(30, 'm').format('YYYY-MM-DDTHH:mm')
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
