import {Meteor} from 'meteor/meteor';
import React from 'react';
import {Tracker} from 'meteor/tracker';
import history from './history';

import { Route, Switch, Redirect } from 'react-router-dom';
import { Session } from 'meteor/session';

import Container from '../ui/Container';
import Signup from '../ui/Signup';
import Login from '../ui/Login';
import NotFound from '../ui/NotFound';
import Verified from '../ui/Verified';
import AdminDashboard from '../ui/AdminDashboard';
import PatientenDashboard from '../ui/PatientenDashboard';

const unauthPages = ['/signup', '/'];
const authPages = ['/dashboard'];

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
                        <Container />) 
                        : (
                            <Redirect to="/" />
                        )
                     }/>           
                <Route exact path="*" render= {
                    () => <NotFound/>
                }
                />
                <Route exact path="/#/verify-email/:token" render= {
                    () => <Verified/>
                }
                />
            </Switch>
        )
    }
}