import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import {Termine} from '../api/termine';
import WartelisteItem from './WartelisteItem';
import FlipMove from 'react-flip-move';

export default class Warteliste extends React.Component {
    constructor(props){
        super(props);
        this.state={
            termine: []
        }
    }

    componentDidMount() {
        this.wartelistTracker = Tracker.autorun(() => {
            Meteor.subscribe('termineWaiting');
            const termine = Termine.find({$and: [{user_id: Meteor.userId()}, {checkedIn: true}, {start:  {$gte: moment().format('YYYY-MM-DD') } }]}).fetch();
            console.log(termine)
            this.setState({termine})
        });
    }

    componentWillUnmount() {
        this.wartelistTracker.stop();
    }
    renderTerminListeItemCheckedIn() {
        if(this.state.termine.length === 0) {
            return (
                <div className="item">
                    <p className="item__status-message">Noch keine Termine im Wartezimmer!</p>
                </div>
            )
        }
        return this.state.termine.map((termin) => {
            if(termin.checkedIn && (moment(termin.start).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'))){
                return <WartelisteItem key={termin._id} {...termin}/>
            }
        });
    }
    render () {
        return (
            <div className="warteliste-container">
                <h2 className="item-title">Im Wartezimmer</h2>
                <FlipMove maintainContainerHeight={true}>
                    {this.renderTerminListeItemCheckedIn()}
                </FlipMove>
            </div>
        );
    }
}