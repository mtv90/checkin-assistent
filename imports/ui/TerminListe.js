import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Termine} from '../api/termine';
import TerminListeItem from './TerminListeItem';
import FlipMove from 'react-flip-move';

export class TerminListe extends React.Component {
    constructor(props){
        super(props);
        this.state={
            termine: []
        }
    }
    renderTerminListeItem(){
        if(this.props.termine.length === 0) {
            return (
                <div className="item">
                    <p className="item__status-message">Keine Termine für heute</p>
                </div>
            )
        }
        return this.props.termine.map((termin) => {
            if(termin.checkedIn === false && (moment(termin.start).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'))){
                return <TerminListeItem key={termin._id} {...termin}/> 
            }
        });
    }
    render () {
        var Spinner = require('react-spinkit');
        if(!this.props.termine){
          return (
              <div className="pacman-view">
                  <Spinner name='pacman' color="#92A8D1" />
              </div>
          )
      }
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
TerminListe.propTypes = {
    termine: PropTypes.array,
}

export default withTracker( (props) => {
    const praxisId = props.praxisId

    Meteor.subscribe('termineToday');
    const termine = Termine.find({$and: [{"praxis.mitarbeiter._id": Meteor.userId()}, {"praxis._id": praxisId}, {"checkedIn": false}, {start:  {$gte: moment().format('YYYY-MM-DD') } }]}).fetch();

    return {
        termine
    };
})(TerminListe);