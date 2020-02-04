import {Meteor} from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import { withTracker  } from 'meteor/react-meteor-data';
import React from 'react';
import history from './history';

import { Router, Route, Switch, Redirect } from 'react-router-dom';

import Signup from '../ui/Signup';
import Login from '../ui/Login';
import NotFound from '../ui/NotFound';
import NotVerified from '../ui/NotVerified';
import Patiententermine from '../ui/Patiententermine';
import Account from '../ui/Account';
import Kalender from '../ui/Kalender';
import Loading from '../ui/Loading';
import Wartezimmer from '../ui/Wartezimmer';
import AdminDashboard from '../ui/AdminDashboard';
import PatientenDashboard from '../ui/PatientenDashboard';
import Praxisverwaltung from '../ui/Praxisverwaltung';
import {Session} from 'meteor/session';

const unauthPages = ['/signup', '/'];
const authPages = ['/dashboard', '/termine', '/wartezimmer', 'praxisverwaltung'];
const verfiedPages = ['/termine', '/wartezimmer'];
let user = {};
let isVerified = false;
let role = '';

export const onAuthChange = (isAuth) => {

        const pathname = history.location.pathname;
        const isUnAuthPage = unauthPages.includes(pathname);
        const isAuthPage = authPages.includes(pathname);

        const user = Meteor.user();
        if(user){
            (authPages && user.role === 'patient') ? (inactivityTimer()) : undefined;
        }
        
        
        if(isUnAuthPage && isAuth) {
          history.replace('/dashboard')
        }
        else if(isAuthPage && !isAuth){
          history.replace('/')
        }


} 

function inactivityTimer() {
    var t;
    resetTimer();
    window.onmousemove = resetTimer; // catches mouse movements
    window.onmousedown = resetTimer; // catches mouse movements
    window.onclick = resetTimer;     // catches mouse clicks
    window.onscroll = resetTimer;    // catches scrolling
    window.onkeypress = resetTimer;  //catches keyboard actions
  
    function logout() {
      console.log('Logged out due inactivity')
      swal("Sie wurden abgemeldet","", "warning").then(() => {
        Accounts.logout();
        history.replace('/') 
        })
        // window.location.href = '/action';  //Adapt to actual logout script
    }
  
//    function reload() {
//           window.location = self.location.href;  //Reloads the current page
//    }
  
   function resetTimer() {
        clearTimeout(t);
        
        t = setTimeout(logout, 600000);  // time is in milliseconds (1000 is 1 second)
        // t= setTimeout(reload, 30000);  // time is in milliseconds (1000 is 1 second)
    }
  }
  

const checkUserIsVerified = (user) => {
    
    const isVerified = user.emails[0].verified;
    const pathname = history.location.pathname;
    const isVerfiedPage = verfiedPages.includes(pathname);
    
    if(!isVerified && isVerfiedPage) {
        history.replace('/not-verified')
        this.isVerified = isVerified;
        return isVerified;
    } else {
        this.isVerified = isVerified;
        return isVerified;
    }
}
const checkUserRole = (user) => {
    const role = user.role;

    if(role) {
        this.role = role;
        return role;
    } 
    // if(!role) {
    //     return <Loading/>
    //     // throw new Meteor.Error("Es wurde keine Benutzerrolle zugewiesen!")
    // }
}


export const checkUserService = (user) => {
    this.user = user;
    Session.set('user', user);
    try{
        checkUserIsVerified(user);
        checkUserRole(user);
    } catch (error) {
        console.log(error)
    }

}

export const isLoggedIn = () => {
    if(Meteor.userId()){
        return true
      }else {
        return false
      }
}

const onEnterPublicPage = () => {
    if(isLoggedIn()) {
        history.replace('/dashboard')
    } 
}

const onEnterDashboard = (props) => {
    
    if(isLoggedIn() && this.user && Roles.userIsInRole(Meteor.userId(), 'admin')){
            
        Session.set('praxisId', props.match.params.id)
        Session.set('dashboard_path', props.match.path)
        return <AdminDashboard user={this.user}/>
    } else if(isLoggedIn() && this.user && Roles.userIsInRole(Meteor.userId(), 'patient')) {
        return <PatientenDashboard user={this.user} />
    } 
}

const onEnterTermine = (props) => {
    if(isLoggedIn() && this.isVerified && (this.role === 'patient')) {
        Session.set('selectedTerminId', props.match.params.id);
        return true;
    } else {
        return false;
    }
}

const onEnterPraxen = (props) => {
    if(isLoggedIn() && this.isVerified && (this.role === 'admin')) {
        Session.set('selectedPraxisId', props.match.params.id)
        return true;
    } else {
        return false;
    }
}

const onEnterKalender = (props) => {
    if(isLoggedIn() && this.isVerified && (this.role === 'admin') ) {
        Session.set('praxisId_termin', props.match.params.id)
        Session.set('termin_path', props.match.path)
        return true;
    } else {
        return false;
    }
}

const onEnterWartezimmer = (props) => {
    if(isLoggedIn() && this.isVerified && (this.role === 'admin') ) {
        Session.set('praxisId_warte', props.match.params.id) 
        Session.set('url_id', props.match.params.id)
        Session.set('wartezimmer_path', props.match.path)
        return true;
    } else {
        return false;
    }
} 

const onEnterKonto = (props) => {
    if(isLoggedIn() && this.isVerified && (this.role === 'patient') ) {
        
        Session.set('selectedKontoDetails', props.match.params.id)
        return true;
    } else {
        return false
    }
}

export const Routes = (
    <Router history={history}>
        <Switch>
            <Route exact path="/" privacy="unauth" render={() => { onEnterPublicPage(); return <Login/> }}/>
            <Route exact path="/signup" render={() => { onEnterPublicPage(); return <Signup/> }}/>
            
            <Route exact path="/dashboard" render={(props) => onEnterDashboard(props) ? onEnterDashboard(props) : <Redirect to="/" />} />
            
            <Route exact path="/dashboard/:id" render={(props) => onEnterDashboard(props) ? onEnterDashboard(props) : <Redirect to="/" />} />
            <Route exact path="/dashboard/:id/termine" render= { (props) => onEnterKalender(props) ? ( <Kalender user={this.user}/> ) : ( <Redirect to="/not-verified" /> ) }/>
            <Route exact path="/dashboard/:id/wartezimmer" render= { (props) => onEnterWartezimmer(props) ? ( <Wartezimmer user={this.user}/> ) : ( <Redirect to="/not-verified" /> ) }/> 
                
            <Route exact path="/praxisverwaltung" render= { () => (isLoggedIn() && this.isVerified && (this.role === 'admin') ) ? ( <Praxisverwaltung user={this.user}/> ) : ( <Redirect to="/not-verified" /> ) }/> 
            <Route exact path="/praxisverwaltung/:id" render= { (props) => onEnterPraxen(props) ? ( <Praxisverwaltung user={this.user}/> ) : ( <Redirect to="/not-verified" /> ) }/>
            <Route exact path="/meine-termine" render= { () => (isLoggedIn() && this.isVerified && (this.role === 'patient') ) ? (<Patiententermine user={this.user}/>) : (<Redirect to="/not-verified" />) } /> 
            <Route exact path="/meine-termine/:id" render= {(props) => onEnterTermine(props) ? <Patiententermine user={this.user}/> : <Redirect to="/not-verified" />}  /> 
            <Route exact path="/patient/:user_id" render= {() => (isLoggedIn() && this.isVerified && (this.role === 'patient') ) ? ( <Account user={this.user}/> ) : ( <Redirect to="/not-verified" /> )}/>
            <Route exact path="/patient/:user_id/:id" render= {(props) => onEnterKonto(props) ? ( <Account user={this.user}/> ) : ( <Redirect to="/not-verified" /> )}/>
            <Route exact path="/not-verified" render = {() => (isLoggedIn() && !this.isVerified) ? ( <NotVerified/> ) : ( <Redirect to="/" />) } /> 
            <Route exact path="*" render= { () => <NotFound/> }/>
        </Switch>
    </Router>
)