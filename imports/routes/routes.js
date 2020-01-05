import {Meteor} from 'meteor/meteor';
import React from 'react';
import history from './history';

import { Route, Switch, Redirect } from 'react-router-dom';
import { Session } from 'meteor/session';

import Container from '../ui/Container';
import Signup from '../ui/Signup';
import Login from '../ui/Login';
import NotFound from '../ui/NotFound';
import AdminDashboard from '../ui/AdminDashboard';
import PatientenDashboard from '../ui/PatientenDashboard';
import Kalender from '../ui/Kalender';
import Wartezimmer from '../ui/Wartezimmer';

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
                <Route exact path="/termine" render= {
                    () => <Kalender/>
                }
                />      
                <Route exact path="/wartezimmer" render= {
                    () => <Wartezimmer/>
                }
                />      
                <Route exact path="*" render= {
                    () => <NotFound/>
                }
                />
 
            </Switch>
        )
    }
}