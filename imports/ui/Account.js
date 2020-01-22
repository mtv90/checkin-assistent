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
                <Patientheader title={`${this.props.user.profile.nachname}, ${this.props.user.profile.vorname}`}/>
                <div className="editor">
                    <h1>{this.props.user.profile.nachname}, {this.props.user.profile.vorname}</h1>
                </div>
            </div>
        )
    }
}