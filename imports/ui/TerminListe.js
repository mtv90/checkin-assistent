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
            Meteor.subscribe('termineToday');
            const termine = Termine.find({$and: [{user_id: Meteor.userId()}, {checkedIn: false}, {start:  {$gte: moment().format('YYYY-MM-DD') } }]}).fetch();
            this.setState({termine})
        });
    }
    componentWillUnmount() {
        this.terminTracker.stop();
    }
    renderTerminListeItemCheckedIn() {
        if(this.state.termine.length === 0) {
            return (
                <div className="item">
                    <p className="item__status-message">Noch Termine im Wartezimmer!</p>
                </div>
            )
        }
        return this.state.termine.map((termin) => {
            if(termin.checkedIn && (moment(termin.start).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'))){
                return <TerminListeItem key={termin._id} {...termin}/>
            }
        });
    }
    renderTerminListeItem(){
        if(this.state.termine.length === 0) {
            return (
                <div className="item">
                    <p className="item__status-message">Keine Termine gefunden</p>
                </div>
            )
        }
        return this.state.termine.map((termin) => {
            if(termin.checkedIn === false && (moment(termin.start).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'))){
                return <TerminListeItem key={termin._id} {...termin}/> 
            }
        });
    }
    render () {
        return (
            <div className="terminliste-container">
                <h2 className="item-title">Heute Geplant</h2>
                <FlipMove maintainContainerHeight={true}>
                    {this.renderTerminListeItem()}
                </FlipMove>
            </div>
        );
    }
}