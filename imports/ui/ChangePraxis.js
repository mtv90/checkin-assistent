import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Session} from 'meteor/session';
import {Praxen} from '../api/praxen';
export class ChangePraxis extends React.Component {
    constructor(props){
        super(props);

    }
    renderPraxen() {
        if(this.props.praxen.length === 0) {
            return (
                <option className="item__status-message">Keine Praxen vorhanden!</option>
            )
        }
        return this.props.praxen.map(( praxis) => {
            return (
                <option key={praxis._id} ref="praxis_id" value={praxis._id}>{praxis.title}</option>
            )
        });
    }

    render() {
        return (
            <div className="dashboard-content">
                <select name="select-praxis" className="admin-input" onChange={(e) => {
                    this.props.Session.set('praxisId', e.target.value)
                } }
                    value={this.props.praxisId}> 
                    <option value="hello">Praxis auswählen...</option>
                    {this.renderPraxen()}
                </select>
            </div>
        )
    }
}
ChangePraxis.propTypes = {
    praxen: PropTypes.array.isRequired,
    Session: PropTypes.object.isRequired
}
export default withTracker( () => {
    const praxisId = Session.get('praxisId');
    Meteor.subscribe('meine_praxen');
    const praxen = Praxen.find().fetch();
    return {
        praxen,
        praxisId,
        Session
    };
})(ChangePraxis);
