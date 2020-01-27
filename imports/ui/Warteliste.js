import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Tracker } from 'meteor/tracker';
import {Termine} from '../api/termine';
import WartelisteItem from './WartelisteItem';
import FlipMove from 'react-flip-move';
import swal from 'sweetalert';

export class Warteliste extends React.Component {
    constructor(props){
        super(props);
        this.state={
            termine: []
        }
    }

    // componentDidMount() {
    //     this.wartelistTracker = Tracker.autorun(() => {
    //         Meteor.subscribe('termineWaiting');
    //         const termine = Termine.find({$and: [{user_id: Meteor.userId()}, {checkedIn: true}, {start:  {$gte: moment().format('YYYY-MM-DD') } }]}).fetch();
    //         this.setState({termine})
    //     });
    // }

    // componentWillUnmount() {
    //     this.wartelistTracker.stop();
    // }
    renderTerminListeItemCheckedIn() {
        if(this.props.termine.length === 0) {
            return (
                <div className="item">
                    <p className="item__status-message">Keine Termine im Wartezimmer</p>
                </div>
            )
        }
        return this.props.termine.map((termin) => {
            if(termin.checkedIn && (moment(termin.start).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'))){
                return <WartelisteItem key={termin._id} {...termin}/>
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
            <div className="warteliste-container">
                <h2 className="item-title">Im Wartezimmer</h2>
                <FlipMove maintainContainerHeight={true}>
                    {this.renderTerminListeItemCheckedIn()}
                </FlipMove>
            </div>
        );
    }
}

Warteliste.propTypes = {
    termine: PropTypes.array,
    // praxisId_warte: PropTypes.string,
}

export default withTracker( (props) => {
    const praxisId = props.praxisId

    Meteor.subscribe('termineWaitingToday');
    const termine = Termine.find({$and: [{"praxis.mitarbeiter._id": Meteor.userId()}, {"praxis._id": praxisId},{"status": "waiting"} , {"checkedIn": true}, {start:  {$gte: moment().format('YYYY-MM-DD') } }]}).fetch();

    return {
        termine
    };
})(Warteliste);