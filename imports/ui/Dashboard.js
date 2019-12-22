import React from 'react';
import { Meteor } from 'meteor/meteor';

import history from '../routes/history';

export default class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          error: ''
        }        
    }
    logingOut(e){
        e.preventDefault();
        Accounts.logout();
    }
    render(){
        return (
            <div className="container">
                <h2>Dashboard</h2>
                <a className="" onClick={this.logingOut.bind(this)}>logout</a>
            </div>
        )
    }
}