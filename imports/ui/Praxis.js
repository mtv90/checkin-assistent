import React from 'react';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Session} from 'meteor/session';

export class Praxis extends React.Component {
    constructor(props){
        super(props);
        this.state= {
        }
    }

    render() {
        const className = this.props.praxis.selected ? 'praxis-item praxis-item--selected' : 'praxis-item'
        return (
            <div className={className} id={this.props.praxis._id} onClick={ () => {
                this.props.Session.set('selectedPraxisId', this.props.praxis._id)
            }}>
                <h5>{this.props.praxis.title}</h5>
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