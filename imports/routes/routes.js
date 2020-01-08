import {Meteor} from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React from 'react';
import history from './history';

import { Route, Switch, Redirect } from 'react-router-dom';
import { Session } from 'meteor/session';

import Container from '../ui/Container';
import Signup from '../ui/Signup';
import Login from '../ui/Login';
import NotFound from '../ui/NotFound';
import NotVerified from '../ui/NotVerified';
import AdminDashboard from '../ui/AdminDashboard';
import PatientenDashboard from '../ui/PatientenDashboard';
import Kalender from '../ui/Kalender';
import Wartezimmer from '../ui/Wartezimmer';

const unauthPages = ['/signup', '/'];
const authPages = ['/dashboard', '/termine', '/wartezimmer'];
const verfiedPages = ['/termine', '/wartezimmer'];

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

export const isLoggedIn = () => {
    if(Meteor.userId()){
        return true
      }else {
        return false
      }
}

export default class Routes extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            isVerified: false
        }
    }
    componentDidMount() {
        Tracker.autorun(() => {
            let isVerified = Session.get('verified');
            this.setState({ isVerified })
        })
    }
    render () {
        return (
            <Switch>
                <Route exact path="/" 
                    render={ () =>
                    !(isLoggedIn()) ? (
                        <Login />
                    ) : (
                        <Redirect to="/dashboard" />
                    )
                    } 
                />
                <Route exact path="/signup" 
                    render={ () =>
                    !(isLoggedIn()) ? (
                        <Signup />
                    ) : (
                        <Redirect to="/dashboard" />
                    )
                    } 
                />
                <Route exact path="/dashboard" render={ () => 
                    isLoggedIn() ? (
                        <Container/>) 
                        : (
                            <Redirect to="/" />
                        )
                     }/> 
                <Route exact path="/termine" render= {
                    () => (isLoggedIn() && this.state.isVerified) ? ( <Kalender/> ) : ( <Redirect to="/not-verified" /> )
                }
                />      
                <Route exact path="/wartezimmer" render= {
                    () => (isLoggedIn() && this.state.isVerified) ? ( <Wartezimmer/> ) : ( <Redirect to="/not-verified" /> )
                }
                /> 
                <Route exact path="/not-verified" render = {
                    () => (isLoggedIn() && !this.state.isVerified) ? ( <NotVerified/> ) : ( <Redirect to="/" />)
                } />     
                <Route exact path="*" render= {
                    () => <NotFound/>
                }
                />
 
            </Switch>
        )
    }
}