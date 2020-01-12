import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Session} from 'meteor/session';

export class PatTerminItem extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            date:''
        }
        
    }
    componentDidMount(){
    }
    render() {
        return (
            <div className="item" id={this.props.termin._id} onClick={ () => {
                this.props.Session.set('selectedTerminId', this.props.termin._id)
            }}>
                <h5>{this.props.termin.title}</h5>
                { this.props.termin.selected ? 'selected' : undefined}
                <p className="item__message">{moment(this.props.termin.start).format("HH:mm | DD.MM.YYYY")}</p>
            </div>
        )
    }
}
PatTerminItem.propTypes = {
    termin: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired
}

export default withTracker( () => {
    return { Session };
})(PatTerminItem);