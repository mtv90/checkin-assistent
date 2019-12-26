import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import {Termine} from '../api/termine';

export default class TerminListe extends React.Component {
    constructor(props){
        super(props);
        this.state={
            termine: []
        }
    }
    componentDidMount() {
        this.terminTracker = Tracker.autorun(() => {
            Meteor.subscribe('termine');
            const termine = Termine.find().fetch();
            this.setState({termine})
        });
    }
    componentWillUnmount() {
        this.terminTracker = Tracker.stop();
    }
    renderTerminListeItem() {
        return this.state.termine.map((termin) => {
            return <p key={termin._id}>{termin.titel}</p> 
        });
    }
    render () {
        return (
            <div>
                <p>Terminliste</p>
                {this.renderTerminListeItem()}
            </div>
        );
    }
}