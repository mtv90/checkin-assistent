import './main.html';

import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';

import React from 'react';
import ReactDOM from 'react-dom';

import history from './../imports/routes/history'
import {Router} from 'react-router-dom';
import { onAuthChange } from '../imports/routes/routes';
import '../imports/startup/simple-schema-configuration';

import App from '../imports/ui/App';
import mkFhir from 'fhir.js';
import axios from 'axios';
import {Termine} from '../imports/api/termine';
import {Session} from 'meteor/session';
import Modal from 'react-modal';
// Modal.setAppElement('#app');

Tracker.autorun(() => {
  const isAuth = !!Meteor.userId();
  onAuthChange(isAuth);
});

Tracker.autorun(() => {
  const admin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const patient = Roles.userIsInRole(Meteor.userId(), 'patient');
  
  Session.set('admin', admin);
  Session.set('patient', patient);

});

Accounts.onEmailVerificationLink((token, done) => {
  Accounts.verifyEmail(token, (error) => { 
    console.log(error);
  });
});

Meteor.startup(() => {

  // http://hapi.fhir.org/baseR4/Appointment
  // axios.get("http://test.fhir.org/r4/Appointment")
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err))
  // var client = mkFhir({
  //   baseUrl: 'http://test.fhir.org/r4/'
  //   });
	// 	client.search({type: 'Appointment'})
	// 		.then(res => {
  //       console.log(res)
	// 			// this.setState({
	// 			// 	patients: res.data.entry,
	// 			// 	selfPage: res.data.link[0].url,
	// 			// 	nextPage: res.data.link[1].url,
	// 			// 	isLoading: false
	// 			//   })
	// 		})
	// 		.catch(err => console.log(err))
  ReactDOM.render(
    <Router history={history}>
      <App/>
    </Router>
    , document.getElementById('app'));
})
