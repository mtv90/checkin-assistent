import React from 'react';
import { Meteor } from 'meteor/meteor';
import Patientheader from './Patientheader';

export default class Account extends React.Component{
    constructor(props) {
        super(props);

        
    }

    componentDidMount() {
        console.log(this.props)
    }
    render() {
        return (
            <div>
                <Patientheader/>
                
            </div>
        )
    }
}