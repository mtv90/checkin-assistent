import {Meteor} from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
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
import Wartezimmer from '../ui/Wartezimmer';
import AdminDashboard from '../ui/AdminDashboard';
import PatientenDashboard from '../ui/PatientenDashboard';
import Loading from '../ui/Loading';
import {Session} from 'meteor/session';

const unauthPages = ['/signup', '/'];
const authPages = ['/dashboard', '/termine', '/wartezimmer'];
const verfiedPages = ['/termine', '/wartezimmer'];
let user = {};
let isVerified = false;
let role = '';

export const onAuthChange = (isAuth) => {
    const pathname = history.location.pathname;
    const isUnAuthPage = unauthPages.includes(pathname);
    const isAuthPage = authPages.includes(pathname);
  
    if(isUnAuthPage && isAuth) {
      history.replace('/dashboard')
    }
    else if(isAuthPage && !isAuth){
      history.replace('/')
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
    } else {
        throw new Meteor.Error("Es wurde keine Benutzerrolle zugewiesen!")
    }
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

// export default class Routes extends React.Component {
//     constructor(props){
//         super(props);
//         this.state ={ 
//             isLoading: false,
//             user:{}
//         };
//         this.onEnterPrivatePage = this.onEnterPrivatePage.bind(this);
//         this.onEnterPublicPage = this.onEnterPublicPage.bind(this);
//     }
//     componentDidMount() {
//         this.setState({isLoading: true});
//         let handle = Meteor.subscribe('user');
//         this.userTracker = Tracker.autorun((run) => {
            
//             let ready = handle.ready();
//             if(ready && !run.firstRun){
//                 const user = Meteor.user();
//                 let verified = user.emails[0].verified
//                 checkUserIsVerified(verified);
//                 this.setState({
//                     user,
//                     isVerified: verified,
//                     isLoading: false,
//                     isReady: true,
//                 });
//             }

//         });
//     }
//     // componentWillUnmount() {
//     //     this.userTracker.stop();
//     // }
//     onEnterPrivatePage() {
//         if(!isLoggedIn()) {
//             history.replace('/')
//         }
//         if(this.state.user.role === 'admin'){
//             return <AdminDashboard user={this.state.user}/>
//         }
//         if(this.state.user.role === 'patient') {
//             return <PatientenDashboard user={this.state.user}/>
//         } else {
//             return false
//         }
//     }
//     onEnterPublicPage() {
//         if(isLoggedIn()) {
//             history.replace('/dashboard')
//         } 
//     }

//     render () {
//         var Spinner = require('react-spinkit');
        
//         if( this.state.isReady) {
//             <div className="pacman-view">
//                 <Spinner name='pacman' color="#92A8D1" />
//             </div>
//         }
//         return (
//             <Switch>
//                 <Route exact path="/" render={ () => { this.onEnterPublicPage(); return <Login/> }} />
//                 <Route exact path="/signup" 
//                     render={ () =>
//                     !(isLoggedIn()) ? (
//                         <Signup />
//                     ) : (
//                         <Redirect to="/dashboard" />
//                     )
//                     } 
//                 />
//                 <Route exact path="/dashboard" render={ () => this.onEnterPrivatePage() ? this.onEnterPrivatePage() : <Redirect to="/"/>}/> 
//                 <Route exact path="/termine" render= {
//                     () => (isLoggedIn() && this.state.isVerified) ? ( <Kalender/> ) : ( <Redirect to="/not-verified" /> )
//                 }
//                 />      
//                 <Route exact path="/wartezimmer" render= {
//                     () => (isLoggedIn() && this.state.isVerified) ? ( <Wartezimmer/> ) : ( <Redirect to="/not-verified" /> )
//                 }
//                 /> 
//                 <Route exact path="/meine-termine" render= { () => this.state.isVerified ? (<Patiententermine/>) : (<Redirect to="/not-verified" />) } /> 
//                 <Route exact path="/meine-termine/:id" render= {() => this.state.isVerified ? <Patiententermine/> : <Redirect to="/not-verified" />}  /> 
    
//                 <Route exact path="/patient/:user_id" render= {() => (isLoggedIn() && this.state.isVerified) ? ( <Account/> ) : ( <Redirect to="/not-verified" /> )}/>
//                 <Route exact path="/not-verified" render = {
//                         () => (isLoggedIn() && !this.state.isVerified) ? ( <NotVerified/> ) : ( <Redirect to="/" />)
//                     } />       

 
//             </Switch>
//         )
//     }
// }
const onEnterPublicPage = () => {
    if(isLoggedIn()) {
        history.replace('/dashboard')
    } 
}

const onEnterDashboard = () => {
   if(isLoggedIn() && this.user && this.role === 'admin'){
       return <AdminDashboard user={this.user}/>
   } else if(isLoggedIn() && this.user && this.role === 'patient') {
       return <PatientenDashboard user={this.user} />
   } else {
       throw new Meteor.Error('Es wurde keine Benutzerrolle zugewiesen!');
   }
}
const onEnterTermine = (props) => {
    if(isLoggedIn() && this.isVerified && (this.role === 'patient')) {
        console.log(props.match.params.id)
        Session.set('selectedTerminId', props.match.params.id)
        return true;
    } else {
        return false;
    }
}
    export const Routes = (
        <Router history={history}>
        <Switch>
            <Route exact path="/" render={() => { onEnterPublicPage(); return <Login/> }}/>
            <Route exact path="/dashboard" render={() => onEnterDashboard() ? onEnterDashboard() : <Redirect to="/" />} />
            <Route exact path="/termine" render= { () => (isLoggedIn() && this.isVerified && (this.role === 'admin') ) ? ( <Kalender user={this.user}/> ) : ( <Redirect to="/not-verified" /> ) }/>
            <Route exact path="/wartezimmer" render= { () => (isLoggedIn() && this.isVerified && (this.role === 'admin') ) ? ( <Wartezimmer user={this.user}/> ) : ( <Redirect to="/not-verified" /> ) }/> 
            <Route exact path="/meine-termine" render= { () => (isLoggedIn() && this.isVerified && (this.role === 'patient') ) ? (<Patiententermine user={this.user}/>) : (<Redirect to="/not-verified" />) } /> 
            <Route exact path="/meine-termine/:id" render= {(props) => onEnterTermine(props) ? <Patiententermine/> : <Redirect to="/not-verified" />}  /> 
            <Route exact path="/patient/:user_id" render= {() => (isLoggedIn() && this.isVerified && (this.role === 'patient') ) ? ( <Account user={this.user}/> ) : ( <Redirect to="/not-verified" /> )}/>
            <Route exact path="/not-verified" render = {() => (isLoggedIn() && !this.isVerified) ? ( <NotVerified/> ) : ( <Redirect to="/" />) } /> 
            <Route exact path="*" render= { () => <NotFound/> }/>
        </Switch>
    </Router>

)
