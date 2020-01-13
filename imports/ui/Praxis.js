import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import Modal from 'react-modal';
import Spinner from 'react-spinkit';

export default class Praxis extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            isLoading: false,
            isOpen: false
        }
    }

    componentDidMount(){
        console.log(this.props.praxis)
    }

    render() {
        return (
            <div className="item" id={this.props._id}>
                <h4>Praxis-Item</h4>

            </div>
        )
    }
}
Praxis.propTypes = {
    praxis: PropTypes.object.isRequired
}