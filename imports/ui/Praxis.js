import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Session} from 'meteor/session';
import swal from 'sweetalert';
import Modal from 'react-modal';
import Spinner from 'react-spinkit';

export class Praxis extends React.Component {
    constructor(props){
        super(props);
        this.state= {
        }
    }

    componentDidMount(){
    }

    render() {
        return (
            <div className="item" id={this.props.praxis._id} onClick={ () => {
                this.props.Session.set('selectedPraxisId', this.props.praxis._id)
            }}>
                <h5>{this.props.praxis.title}</h5>
                { this.props.praxis.selected ? 'selected' : undefined}
                <p className="item__message">
                <small>{this.props.praxis.strasse} {this.props.praxis.nummer}<br/>
                {this.props.praxis.plz} {this.props.praxis.stadt}</small></p>
            </div>
        )
    }
}
Praxis.propTypes = {
    praxis: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired
}

export default withTracker( () => {
    return { Session };
})(Praxis);