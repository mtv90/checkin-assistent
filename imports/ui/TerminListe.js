import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import {Termine} from '../api/termine';
import TerminListeItem from './TerminListeItem';
import FlipMove from 'react-flip-move';

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
        this.terminTracker.stop();
    }
    renderTerminListeItem() {
        if(this.state.termine.length === 0) {
            return (
                <div className="item">
                    <p className="item__status-message">Keine Termine gefunden</p>
                </div>
            )
        }
        return this.state.termine.map((termin) => {
            return <TerminListeItem key={termin._id} {...termin}/>
            // return <p key={termin._id}>{termin.titel}</p> 
        });
    }
    render () {
        return (
            <div>
                <FlipMove maintainContainerHeight={true}>
                    {this.renderTerminListeItem()}
                </FlipMove>
            </div>
        );
    }
}