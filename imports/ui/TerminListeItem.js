import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import swal from 'sweetalert';

export default class TerminListeItem extends React.Component {
    constructor(props){
        super(props);
    }

    handleRemoveItem(e){
        
        e.preventDefault();
        const _id = this.props._id;
        if(!!_id){
            Meteor.call('termine.remove', _id,
                (err, res) => {
                    if(err) {
                        swal("Fehler", `${err.error}`, "error");
                    } else {
                        swal("Daten wurden erfolgreich entfernt", '', "success");
                    }
                }
            )
        }
    }
    checkIn(e){
        e.preventDefault();
        let termin = {
            ...this.props
        };
        
        if(!!termin._id){
            termin['checkedIn'] = true;
            Meteor.call('termin.checkIn', termin._id, termin,
                (err, res) => {
                    if(err) {
                        swal("Fehler", `${err.error}`, "error");
                    } else {
                        swal("Patient erfolgreich eingechecked", "Er kann nun einem Behandlungszimmer zugewiesen werden.", "success");
                    }
                }
            );
        }
    }
    render() {
        return (
            <div className="item" id={this.props._id}>
                <h2>{this.props.title}</h2>
                {/* <p className="item__message">Hier sollen mal Termin etc. stehen</p> */}
                <button type="button" className="button button--pill" onClick={this.checkIn.bind(this)}>einchecken</button>
                <button type="button" className="button button--pill" onClick={() => alert('Test 2')}>bearbeiten</button>
                <button type="button" className="button button--pill" onClick={this.handleRemoveItem.bind(this)}>löschen</button>
            </div>
        )
    }
}
TerminListeItem.propTypes = {
    _id: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired
}
