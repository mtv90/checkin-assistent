import './main.html';

import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';

import React from 'react';
import ReactDOM from 'react-dom';

import history from './../imports/routes/history'
import {Router} from 'react-router-dom';
import { onAuthChange} from '../imports/routes/routes';
import '../imports/startup/simple-schema-configuration';

import App from '../imports/ui/App';

Tracker.autorun(() => {
  const isAuth = !!Meteor.userId();
  onAuthChange(isAuth);
})
Accounts.onEmailVerificationLink((token, done) => {
  // history.push(`/verify-email/${token}`);
  console.log(token)
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
