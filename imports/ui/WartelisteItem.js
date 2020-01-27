import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import Modal from 'react-modal';
import Spinner from 'react-spinkit';

export default class WartelisteItem extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            isLoading: false,
            isOpen: false
        }
    }

    uncheckItem(e){
        e.preventDefault();
        let termin = {
            ...this.props
        };
        
        if(!!termin._id){
            termin['checkedIn'] = false;
            termin['status'] ="open";

            Meteor.call('termin.check', termin._id, termin,
                (err, res) => {
                    if(err) {
                        swal("Fehler", `${err.error}`, "error");
                    } else {
                        this.setState({isLoading: false})
                        swal("Patient ausgechecked", "", "warning");
                    }
                }
            );
        }
    }
    componentDidMount(){
       console.log(this.props)
    }
    render() {
        return (
            <div className="item drag-it" id={this.props._id}>
                <h5>{this.props.title}</h5>
                    <p className="item__message">
                        <small>{moment(this.props.start).format('HH:mm')} Uhr <br/>
                        {this.props.subject}</small>
                    </p>
                <button type="button" className="button button--pill" onClick={this.uncheckItem.bind(this)}>checkout</button>
            </div>
        )
    }
}
WartelisteItem.propTypes = {
    _id: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired
}
