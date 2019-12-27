import React from 'react';
import { Meteor } from 'meteor/meteor';

import history from '../routes/history';

export default class Dashboard extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div>
                <p>PatientenDashboard</p>
            </div>
        )
    }
}