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
        const className = this.props.termin.selected ? 'pat-termin-item pat-termin-item--selected' : 'pat-termin-item'
        return (
            <div className={className} id={this.props.termin._id} onClick={ () => {
                this.props.Session.set('selectedTerminId', this.props.termin._id)
            }}>
                <h5>{this.props.termin.subject}</h5>
                
                <p className="item__message">{moment(this.props.termin.start).format("HH:mm")} Uhr | {moment(this.props.termin.start).format("DD.MM.YYYY")}</p>
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